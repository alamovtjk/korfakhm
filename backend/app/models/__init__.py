from sqlalchemy import Column, Integer, String, Text, JSON, DateTime, ForeignKey
from sqlalchemy.sql import func
from app.database import Base


class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(200), unique=True, nullable=False, index=True)
    password_hash = Column(String(200), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class QuizResult(Base):
    __tablename__ = 'quiz_results'

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id', ondelete='SET NULL'), nullable=True)
    riasec = Column(JSON)                   # {"R":70,"I":85,"A":60,"S":45,"E":55,"C":50}
    professions = Column(JSON)              # [{"name":..., "score":..., "emoji":..., "category":...}]
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class IQResult(Base):
    __tablename__ = 'iq_results'

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id', ondelete='SET NULL'), nullable=True)
    iq_score = Column(Integer, nullable=False)
    level = Column(String(50))
    percentile = Column(Integer)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Vacancy(Base):
    __tablename__ = 'vacancies'

    id = Column(Integer, primary_key=True, index=True)
    company = Column(String(200), nullable=False)
    position = Column(String(200), nullable=False)
    category = Column(String(100))
    salary = Column(String(100))
    city = Column(String(100))
    type = Column(String(50))
    description = Column(Text)
    contact = Column(String(200))
    owner_email = Column(String(200), nullable=True)
    status = Column(String(50), default='published')
    created_at = Column(DateTime(timezone=True), server_default=func.now())
