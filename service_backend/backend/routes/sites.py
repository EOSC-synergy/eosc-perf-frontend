"""Site routes."""
from backend.extensions import auth
from backend.models import models
from backend.schemas import query_args, schemas
from flaat import tokentools
from flask import request
from flask.views import MethodView
from flask_smorest import Blueprint

blp = Blueprint(
    'sites', __name__, description='Operations on sites'
)


@blp.route('')
class Root(MethodView):

    @blp.doc(operationId='GetSites')
    @blp.arguments(query_args.SiteFilter, location='query')
    @blp.response(200, schemas.Site(many=True))
    def get(self, args):
        """Filters and list sites."""
        return models.Site.filter_by(**args)

    @auth.login_required()
    @blp.doc(operationId='AddSite')
    @blp.arguments(schemas.SiteCreate, as_kwargs=True)
    @blp.response(201, schemas.Site)
    def post(self, **kwargs):
        """Creates a new site."""
        access_token = tokentools.get_access_token_from_request(request)
        report = models.Report(
            uploader=models.User.get(token=access_token),
        )
        return models.Site.create(reports=[report], **kwargs)


@blp.route('/search')
class Search(MethodView):

    @blp.doc(operationId='SearchSites')
    @blp.arguments(query_args.SiteSearch, location='query')
    @blp.response(200, schemas.Site(many=True))
    def get(self, search):
        """Filters and list sites."""
        return models.Site.query_with(**search)


@blp.route('/<uuid:site_id>')
class Site(MethodView):

    @blp.doc(operationId='GetSite')
    @blp.response(200, schemas.Site)
    def get(self, site_id):
        """Retrieves site details."""
        return models.Site.get_by_id(site_id)

    @auth.admin_required()
    @blp.doc(operationId='EditSite')
    @blp.arguments(schemas.SiteEdit, as_kwargs=True)
    @blp.response(204)
    def put(self, site_id, **kwargs):
        """Updates an existing site."""
        models.Site.get_by_id(site_id).update(**kwargs)

    @auth.admin_required()
    @blp.doc(operationId='DelSite')
    @blp.response(204)
    def delete(self, site_id):
        """Deletes an existing site."""
        models.Site.get_by_id(site_id).delete()


@blp.route('/<uuid:site_id>/flavors')
class Flavors(MethodView):

    @blp.doc(operationId='GetFlavors')
    @blp.arguments(query_args.FlavorFilter, location='query')
    @blp.response(200, schemas.Flavor(many=True))
    def get(self, args, site_id):
        """Filters and list flavors."""
        site_flavors = models.Site.get_by_id(site_id).flavors
        def filter(a, **kw): return all(getattr(a, k) == kw[k] for k in kw)
        return [x for x in site_flavors if filter(x, **args)]

    @auth.login_required()
    @blp.doc(operationId='AddFlavor')
    @blp.arguments(schemas.FlavorCreate, as_kwargs=True)
    @blp.response(201, schemas.Flavor)
    def post(self, site_id, **kwargs):
        """Creates a new flavor on a site."""
        access_token = tokentools.get_access_token_from_request(request)
        site = models.Site.get_by_id(site_id)
        report = models.Report(
            uploader=models.User.get(token=access_token),
        )
        flavor = models.Flavor(reports=[report], site_id=site.id, **kwargs)
        site.update(flavors=site.flavors+[flavor])
        return flavor


@blp.route('/flavors/<uuid:flavor_id>')
class Flavor(MethodView):

    @blp.response(200, schemas.Flavor)
    @blp.doc(operationId='GetFlavor')
    def get(self, flavor_id):
        """Retrieves flavor details."""
        return models.Flavor.get_by_id(id=flavor_id)

    @auth.admin_required()
    @blp.doc(operationId='EditFlavor')
    @blp.arguments(schemas.FlavorEdit, as_kwargs=True)
    @blp.response(204)
    def put(self, flavor_id, **kwargs):
        """Updates an existing site."""
        models.Flavor.get_by_id(id=flavor_id).update(**kwargs)

    @auth.admin_required()
    @blp.doc(operationId='DelFlavor')
    @blp.response(204)
    def delete(self, flavor_id):
        """Deletes an existing site."""
        models.Flavor.get_by_id(id=flavor_id).delete()