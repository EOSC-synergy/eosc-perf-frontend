"""Factories package to offer utils to fill the backend database."""
from datetime import datetime

from backend import database
from factory.fuzzy import FuzzyNaiveDateTime


fdt = FuzzyNaiveDateTime(datetime(2000, 1, 1))


class BaseMeta:
    """Factory configuration."""
    # Use the not-so-global scoped_session
    # Warning: DO NOT USE common.Session()!
    sqlalchemy_session = database.db.session