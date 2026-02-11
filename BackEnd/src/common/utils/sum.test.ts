import { describe,it,expect } from "vitest";
import {sum} from './sum'

describe('sum fucntion ',()=>{
    it('adds two numbers correctly',()=>{
        expect(sum(2,3)).toBe(5)
    })
})