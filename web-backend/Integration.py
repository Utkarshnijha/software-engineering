# web-backend/Integration.py

from sqlalchemy import (
    Column, Integer, String, DateTime, ForeignKey,
    CheckConstraint, Boolean, create_engine
)
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime

DATABASE_URL = "postgresql://postgres:1234@db:5432/Titanic_Databases"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)

Base = declarative_base()

class Registered_User(Base):
    __tablename__ = 'Registered_User'
    User_id  = Column(Integer, primary_key=True)
    Username = Column(String, unique=True, nullable=False)
    Email    = Column(String, unique=True, nullable=False)
    Password = Column(String, nullable=False)

class TrainedModel(Base):
    __tablename__ = 'Models'
    Model_id   = Column(Integer, primary_key=True)
    Model_Type = Column(String, nullable=False)


class PredictionHistory(Base):
    __tablename__ = 'Calc_History'

    History_id      = Column(Integer, primary_key=True)
    pclass          = Column(
        'class', Integer,
        CheckConstraint('"class" IN (1,2,3)', name='ck_class_values'),
        nullable=False
    )
    sex             = Column(
        'sex', Integer,
        CheckConstraint('"sex" IN (0,1)', name='ck_sex_values'),
        nullable=False
    )
    age             = Column(
        'age', Integer,
        CheckConstraint('"age" >= 0 AND "age" <= 100', name='ck_age_range'),
        nullable=False
    )
    fare            = Column(
        'fare', Integer,
        CheckConstraint('"fare" >= 0 AND "fare" <= 500', name='ck_fare_range'),
        nullable=False
    )
    parch           = Column('parch', Integer, nullable=False)
    sibsp           = Column('sibsp', Integer, nullable=False)
    travel_status   = Column(
        'travel_status', Integer,
        CheckConstraint('"travel_status" IN (0,1)', name='ck_travel_status'),
        nullable=False
    )
    embark          = Column(
        'embark', Integer,
        CheckConstraint('"embark" IN (0,1,2)', name='ck_embark_values'),
        nullable=False
    )
    title           = Column(
        'title', Integer,
        CheckConstraint('"title" IN (0,1,2,3,4)', name='ck_title_values'),
        nullable=False
    )
    survival_status = Column('survival_status', Boolean, nullable=False)
    model_used      = Column('model_used', Integer, ForeignKey('Models.Model_id'))
    created_by      = Column('created_by', Integer, ForeignKey('Registered_User.User_id'))
    created_at      = Column('created_at', DateTime, default=datetime.utcnow, nullable=False)
