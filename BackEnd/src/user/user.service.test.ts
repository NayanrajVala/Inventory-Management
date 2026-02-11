import { describe, it, expect, beforeEach, vi } from 'vitest'
import { UserService } from './user.service'
import { PrismaService } from '.././prisma.service'

// describe('UserService - create()', () => {
//   let service: UserService
//   let mockPrisma: any

//   beforeEach(() => {
//     mockPrisma = {
//       user: {
//         create: vi.fn(),
//       },
//     }

//     service = new UserService(mockPrisma)
//   })

//   it('should create a new user', async () => {
//     const input = {
//       name: 'Nayan',
//       email: 'test@test.com',
//     }

//     const createdUser = { id: 1, ...input }

//     mockPrisma.user.create.mockResolvedValue(createdUser)

//     const result = await service.create(input as any)

//     expect(mockPrisma.user.create).toHaveBeenCalledWith({ data: input })
//     expect(result).toEqual(createdUser)
//   })
// })

// describe("UserService-findUnique()",()=>{
//   let service:UserService;
//   let mockPrisma:any
//   beforeEach(()=>{
//     mockPrisma={
//       user:{
//         findUnique:vi.fn()
//       },
//     }
//     service = new UserService(mockPrisma)
//   })

//   it("should find user",async()=>{
//     const fakeUser = {
//       id:1,
//       email:"test@test.com",
//       name:"nayan"
//     }

//     mockPrisma.user.findUnique.mockResolvedValue(fakeUser)

//     const result = await service.findByEmail("test@test.com")

//     expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({where:{
//       email:"test@test.com"
//     }})
//     expect(result).toEqual(fakeUser)
//   })

//   it("should return null when user not found",async()=>{
    

//     mockPrisma.user.findUnique.mockResolvedValue(null)

//     const result = await service.findByEmail("fake@test.com")

//     expect(result).toBeNull()
//   })
// })

describe("UserService",async()=>{
  let service:UserService
  let mockPrisma:any

  beforeEach(()=>{
    mockPrisma={
      user:{
        create:vi.fn(),
        findUnique:vi.fn()
      }
    }

    service = new UserService(mockPrisma)
  })

  describe("Create",()=>{
    it('should create a new user',async()=>{
      const input ={
        name:'nayan',
        email:"test@test.com"
      }

      const createdUser = {id:1,...input}

      mockPrisma.user.create.mockResolvedValue(createdUser)

      const result = await service.create(input as any)

      expect(mockPrisma.user.create).toHaveBeenCalledWith({data:input})
      expect(result).toBe(createdUser)
    })
  })

  describe("FindByEmail",()=>{
    it("should find user",async ()=>{
      const fakeUser = {
        id:1,
        email:"test@test.com",
        name:"Nayan"
      }

      mockPrisma.user.findUnique.mockResolvedValue(fakeUser)

      const result = await service.findByEmail("test@test.com")

      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({where:{email:"test@test.com"}})
      expect(result).toBe(fakeUser)
    })

    it("should return null for wrong email",async ()=>{
      mockPrisma.user.findUnique.mockResolvedValue(null)

      const result = await service.findByEmail("fake@test.com")

      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({where:{email:"fake@test.com"}})
      expect(result).toBeNull()
    })
  })

})