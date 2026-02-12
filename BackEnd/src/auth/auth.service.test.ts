import { describe,vi,expect,beforeEach,it } from "vitest";
import { AuthService } from "./auth.service";


describe("AuthService",async()=>{
    let service:AuthService

    let mockPrisma:any
    let mockUserService:any
    let mockJwt:any
    let mockRedis:any
    let mockMail:any

    beforeEach(()=>{
        mockUserService = {
            findByEmail:vi.fn(),
            create:vi.fn(),
            verifyUser:vi.fn()
        }

        mockJwt = {
            sign:vi.fn(),
            verify:vi.fn()
        }

        mockRedis = {
            set:vi.fn(),
            get:vi.fn()
        }

        mockMail = {
            sendOtp:vi.fn()
        }

        mockPrisma = {
            user:{
                update:vi.fn(),
                findUnique:vi.fn()
            }
        }

        service = new AuthService(
            mockUserService,
            mockJwt,
            mockMail,
            mockMail,
            mockRedis
        )

        describe('signup',async()=>{
            it("should create user successfully",async()=>{
                mockUserService.findByEmail.mockResolvedValue(null)
                mockUserService.create.mockResolvedValue({
                    id:1,
                    name:"Nayan",
                    email:"test@test.com",
                    roles:['USER'],
                });

                const result  = await service.signup


            })
        })
        
    })
})