from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship, DeclarativeBase


class Base(DeclarativeBase):
    pass

class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)

    products = relationship("Product", back_populates="category")


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    image = Column(String, nullable=True)
    description = Column(String, nullable=True)
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=False)

    category = relationship("Category", back_populates="products")
    order_items = relationship("OrderItems", back_populates="product")


class Orders(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    CustomerId = Column(Integer, nullable=False)
    Organization=Column(String, nullable=False)
    OrderDate = Column(DateTime, nullable=False)
    DeliveryDate = Column(DateTime, nullable=False)
    
    order_items = relationship("OrderItems", back_populates="order")


class OrderItems(Base):
    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True, index=True)
    OrderId = Column(Integer, ForeignKey("orders.id"), nullable=False)
    ProductId = Column(Integer, ForeignKey("products.id"), nullable=False)
    Quantity = Column(Integer, nullable=False)

    order = relationship("Orders", back_populates="order_items")
    product = relationship("Product", back_populates="order_items")
