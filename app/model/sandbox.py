from .data_types import *
from .database import db

uploaders = [Uploader(email='user1@example.com'), Uploader(email='user@example.com')]
sites = [Site(short_name='rpi', address='192.168.1.2', description="My cool raspberry pi"), Site(short_name="terrapc", address='127.0.0.1', description="My strong desktop PC")]
benchmarks = [Benchmark(docker_name='user/bench:version', uploader=uploaders[0]), Benchmark(docker_name='user/otherbench:version', uploader=uploaders[0])]
tags = [Tag(name='neato'), Tag(name='cpu')]
results = []
for uploader in uploaders:
   for site in sites:
        for benchmark in benchmarks:
             for tag in tags:
                result = Result(json="{}", uploader=uploader, site=site, benchmark=benchmark, tags=[tag])
                results.append(result)

def add_dummies_if_not_exist(app):
    app.app_context().push()
    for uploader in uploaders:
        db.session.add(uploader)

    for site in sites:
        db.session.add(site)
    
    for benchmark in benchmarks:
        db.session.add(benchmark)

    for tag in tags:
        db.session.add(tag)

    for result in results:
        db.session.add(result)

    try:
        db.session.commit()
    except:
        # things already exist, just roll back
        db.session.rollback()