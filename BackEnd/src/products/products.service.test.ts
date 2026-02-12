import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ProductsService } from './products.service';
import { ProductNotFoundException } from '../common/exceptions/productNotFound.exception';

describe('ProdcutService', () => {
  let service: ProductsService;
  let mockPrisma: any;
  beforeEach(() => {
    mockPrisma = {
      product: {
        findMany: vi.fn(),
        count: vi.fn(),
        findUnique: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
      },
    };

    service = new ProductsService(mockPrisma);
  });

  describe('findMany', async () => {
    it('returns paginated product successfully', async () => {
      const fakeProducts = [{ id: 1 }, { id: 2 }];
      mockPrisma.product.findMany.mockResolvedValue(fakeProducts);
      mockPrisma.product.count.mockResolvedValue(2);

      const result = await service.findAll(1, 5, '', 'name', 'asc');

      expect(result).toEqual({
        data: fakeProducts,
        total: 2,
        page: 1,
        lastPage: 1,
      });
    });

    it('calculates skip correctly for pagination', async () => {
      mockPrisma.product.findMany.mockResolvedValue([]);
      mockPrisma.product.count.mockResolvedValue(0);

      await service.findAll(2, 5, '', 'name', 'asc');

      expect(mockPrisma.product.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 5,
          take: 5,
        }),
      );
    });

    it('applies search filter when search is provided', async () => {
      mockPrisma.product.findMany.mockResolvedValue([]);
      mockPrisma.product.count.mockResolvedValue(0);

      await service.findAll(1, 5, 'cycle', 'createdAt', 'asc');

      expect(mockPrisma.product.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            name: {
              contains: 'cycle',
              mode: 'insensitive',
            },
          },
        }),
      );
    });

    it('does not apply search filter when search is empty', async () => {
      mockPrisma.product.findMany.mockResolvedValue([]);
      mockPrisma.product.count.mockResolvedValue();

      await service.findAll(1, 5, '', 'name', 'asc');

      expect(mockPrisma.product.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {},
        }),
      );
    });

    it('applies sorting correctly', async () => {
      mockPrisma.product.findMany.mockResolvedValue([]);
      mockPrisma.product.count.mockResolvedValue(0);

      await service.findAll(1, 5, '', 'name', 'desc');

      expect(mockPrisma.product.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: { name: 'desc' },
        }),
      );
    });

    it('should calculate last Page correctly', async () => {
      mockPrisma.product.findMany.mockResolvedValue({ id: 1 });
      mockPrisma.product.count.mockResolvedValue(25);

      const result = await service.findAll(1, 5, '', 'id', 'asc');

      expect(result.lastPage).toBe(5);
    });
  });


  describe('create',async()=>{

    it("should create a product",async()=>{
        const dto = {
            name:"Laptop",
            price:10000
        }

        const createdProduct = {
            id:1,
            ...dto,
        }

        mockPrisma.product.create.mockResolvedValue(createdProduct)

        const result = await service.create(dto as any)

        expect(mockPrisma.product.create).toHaveBeenCalledWith({data:dto})
        expect(result).toEqual(createdProduct)
    })

    it("should throw error if prisma fails",async()=>{
        const dto = {name:"Laptop",price:10000}

        mockPrisma.product.create.mockRejectedValue(
            new Error("DB error")
        )

        await expect(service.create(dto as any)).rejects.toThrow('DB error')
    })
  })

  describe("update",async()=>{
    it("should update product if exists",async()=>{
        const id='123'

        const dto={
            name:"updated Laptop"
        }

        const existingProduct={
            id,
            name:"old Laptop"
        }

        const updatedProduct = {
            id,
            ...dto
        }

        mockPrisma.product.findUnique.mockResolvedValue(existingProduct)
        mockPrisma.product.update.mockResolvedValue(updatedProduct)

        const result  = await service.updateProduct(id,dto as any)

        expect(mockPrisma.product.findUnique).toHaveBeenCalledWith({
            where:{id},
        })

        expect(mockPrisma.product.update).toHaveBeenCalledWith({
            where:{id},
            data:dto
        })

        expect(result).toEqual(updatedProduct)
    })

    it("should give ProductNotFoundException when product does not exist",async()=>{
        const id ='999'

        mockPrisma.product.findUnique.mockResolvedValue(null)

        await expect(service.updateProduct(id,{} as any)).rejects.toThrow(ProductNotFoundException)

        expect(mockPrisma.product.update).not.toHaveBeenCalled()
    })
  })

  describe("delete",async()=>{

    it("should delete product",async()=>{
        const id = '123'

        const deletedProduct = {
            id,
            name:'Laptop'
        }

        mockPrisma.product.delete.mockResolvedValue(deletedProduct)

        const result = await service.deleteProduct(id)

        expect(mockPrisma.product.delete).toHaveBeenCalledWith({
            where:{id}
        })

        expect(result).toEqual(deletedProduct)
    })

    it("should throw error if prisma delete fails",async()=>{
        mockPrisma.product.delete.mockRejectedValue(new Error ("DB Error"))

        await expect(service.deleteProduct('123')).rejects.toThrow('DB Error')
    })
  })
});
