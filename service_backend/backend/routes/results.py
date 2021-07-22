"""Result routes."""
from backend.extensions import auth
from backend.models import models
from backend.schemas import query_args, schemas
from flaat import tokentools
from flask import request
from flask.views import MethodView
from flask_smorest import Blueprint, abort
from sqlalchemy import and_

blp = Blueprint(
    'results', __name__, description='Operations on results'
)


@blp.route('')
class Root(MethodView):

    @blp.doc(operationId='GetResults')
    @blp.arguments(query_args.ResultFilter, location='query', as_kwargs=True)
    @blp.response(200, schemas.Result(many=True))
    def get(self, tag_names, before, after, filters, **query):
        """Filters and list results.

        Method to get a list of results based on a query based matching
        conditions:
         - docker_image: Returns the results matching the docker image.
         - docker_tag: Returns the results matching the docker tag.
         - site_name: Returns the results matching the site name.
         - flavor_name: Returns the results matching the flavor name.
         - tag_names: Returns the results matching the list of tag names.
         - upload_before: Returns the results uploaded before a ISO8601 date.
         - upload_after: Returns the results uploaded after a ISO8601 date.
         - filters: A set of matching conditions (to describe bellow).

        This method allows to return results filtered by values inside the
        result. The filter is composed by 3 arguments separated by spaces
        ('%20' on URL-encoding): <path.separated.by.dots> <operator> <value>

        There are five filter operators:
         - Equals ( == :: %3D%3D ): Return results where path value is exact 
           to the query value. 
           For example 'filters=machine.cpu.count%20%3D%3D%205'
         - Greater than ( > :: %3E ): Return results where path value 
           strictly greater than the query value.
           For example 'filters=machine.cpu.count%20%3E%205'
         - Less than ( < :: %3C ): Return results where path value strictly
           lower than the query value.
           For example 'filters=machine.cpu.count%20%3C%205'
         - Greater or equal ( >= :: %3E%3D ): Return results where path value
           is equal or greater than the query value.
           For example 'filters=machine.cpu.count%20%3E%3D%205'
         - Less or equal ( <= :: %3C%3D ): Return results where path value is
           equal or lower than the query value.
           For example 'filters=machine.cpu.count%20%3C%3D%205'

        Note that all the components of the filter must be URL-encoded in
        order to be included in URL query strings. You can use the swagger GUI
        to automatically handle the codification, but the space separator must
        be included.
        """
        # First query definition using main filters
        results = models.Result.query.filter_by(**query)

        # Extend query with tags
        if type(tag_names) == list:
            results = results.filter(models.Result.tag_names.in_(tag_names))

        # Extend query with date filter
        if before:
            results = results.filter(models.Result.upload_date < before)
        if after:
            results = results.filter(models.Result.upload_date > after)

        # Extend query with filters
        parsed_filters = []
        for filter in filters:
            try:
                path, operator, value = tuple(filter.split(' '))
            except ValueError as err:
                abort(422, messages={
                    'filter': filter, 'reason': err.args,
                    'hint': "Probably missing spaces (%20)",
                    'example': "filters=machine.cpu.count%20%3E%205"
                })
            path = tuple(path.split('.'))
            if operator is None:
                abort(422, "filter operator not defined")
            elif operator == "<":
                parsed_filters.append(models.Result.json[path] < value)
            elif operator == ">":
                parsed_filters.append(models.Result.json[path] > value)
            elif operator == ">=":
                parsed_filters.append(models.Result.json[path] >= value)
            elif operator == "<=":
                parsed_filters.append(models.Result.json[path] <= value)
            elif operator == "==":
                parsed_filters.append(models.Result.json[path] == value)
            else:
                abort(422, message={
                    'filter': f"Unknown filter operator: '{operator}'",
                    'hint': "Use only one of ['==', '>', '<', '>=', '<=']"
                })
        try:
            return results.filter(and_(*parsed_filters))
        except Exception as err:
            abort(422, message={'filter': err.args})

        return query.all()

    @auth.login_required()
    @blp.doc(operationId='AddResult')
    @blp.arguments(query_args.ResultContext, location='query')
    @blp.arguments(schemas.Json)
    @blp.response(201, schemas.Result)
    def post(self, query_args, json):
        """Creates a new result."""
        access_token = tokentools.get_access_token_from_request(request)
        return models.Result.create(
            uploader=models.User.get(token=access_token),
            json=json,
            reports=[],
            benchmark=models.Benchmark.get_by_id(query_args['benchmark_id']),
            site=models.Site.get_by_id(query_args['site_id']),
            flavor=models.Flavor.get_by_id(query_args['flavor_id']),
            tags=[models.Tag.get_by_id(id) for id in query_args['tags_ids']]
        )


@blp.route('/search')
class Search(MethodView):

    @blp.doc(operationId='SearchResults')
    @blp.arguments(query_args.ResultSearch, location='query')
    @blp.response(200, schemas.Result(many=True))
    def get(self, search):
        """Filters and list results."""
        return models.Result.query_with(**search)


@blp.route('/<uuid:result_id>')
class Result(MethodView):

    @blp.doc(operationId='GetResult')
    @blp.response(200, schemas.Result)
    def get(self, result_id):
        """Retrieves result details."""
        return models.Result.get_by_id(result_id)

    @auth.login_required()
    @blp.doc(operationId='EditResult')
    @blp.arguments(schemas.TagsIds, as_kwargs=True)
    @blp.response(204)
    def put(self, result_id, tags_ids=None):
        """Updates an existing result tags."""
        access_token = tokentools.get_access_token_from_request(request)
        token_info = tokentools.get_accesstoken_info(access_token)
        result = models.Result.get_by_id(result_id)
        valid_uploader = all([
            result.uploader_iss == token_info['body']['iss'],
            result.uploader_sub == token_info['body']['sub']
        ])
        if auth.valid_admin() or valid_uploader:
            if tags_ids is not None:  # Empty list should pass
                tags = [models.Tag.get_by_id(id) for id in tags_ids]
                result.update(tags=tags)
        else:
            abort(403)

    @auth.admin_required()
    @blp.doc(operationId='DelResult')
    @blp.response(204)
    def delete(self, result_id):
        """Deletes an existing result."""
        models.Result.get_by_id(result_id).delete()


@blp.route('/<uuid:result_id>/uploader')
class Uploader(MethodView):

    @auth.admin_required()
    @blp.doc(operationId='GetResultUploader')
    @blp.response(200, schemas.User)
    def get(self, result_id):
        """Retrieves result uploader."""
        return models.Result.get_by_id(result_id).uploader


@blp.route('/<uuid:result_id>/report')
class Report(MethodView):

    @auth.login_required()
    @blp.doc(operationId='AddResultReport')
    @blp.arguments(schemas.ReportCreate)
    @blp.response(201, schemas.Report)
    def post(self, json, result_id):
        """Creates a result report."""
        access_token = tokentools.get_access_token_from_request(request)
        result = models.Result.get_by_id(result_id)
        report = models.Report(
            uploader=models.User.get(token=access_token),
            message=json['message']
        )
        result.update(reports=result.reports+[report])
        return report