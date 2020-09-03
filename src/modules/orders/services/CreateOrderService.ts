import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICustomersRepository from '@modules/customers/repositories/ICustomersRepository';
import Order from '../infra/typeorm/entities/Order';
import IOrdersRepository from '../repositories/IOrdersRepository';

interface IProduct {
  id: string;
  quantity: number;
}

interface IRequest {
  customer_id: string;
  products: IProduct[];
}

@injectable()
class CreateOrderService {
  constructor(
    @inject('OrdersRepository')
    private ordersRepository: IOrdersRepository,
    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,
    @inject('CustomersRepository')
    private customersRepository: ICustomersRepository,
  ) {}

  public async execute({ customer_id, products }: IRequest): Promise<Order> {
    const productsEntity = await this.productsRepository.findAllById(
      products || [],
    );
    const customer = await this.customersRepository.findById(customer_id);

    if (!customer) throw new AppError('Customer nao encontrado');
    if (productsEntity.length !== products.length)
      throw new AppError('Produtos nao encontrados');

    products.forEach(product => {
      if (
        product.quantity >
        (productsEntity.find(productEntity => productEntity.id === product.id)
          ?.quantity || 0)
      )
        throw new AppError('Quantidade insuficiente');
    });

    const orders = await this.ordersRepository.create({
      customer,
      products: productsEntity.map(product => {
        const quantity =
          products.find(productQuantity => productQuantity.id === product.id)
            ?.quantity || 0;
        return {
          price: product.price,
          product_id: product.id,
          quantity,
        };
      }),
    });

    await this.productsRepository.updateQuantity(products);

    return orders;
  }
}

export default CreateOrderService;
