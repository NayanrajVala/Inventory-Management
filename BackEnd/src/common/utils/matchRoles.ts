import { Role } from "../enums/role.enum";

export function matchRoles(requiredRoles:Role[],userRoles:Role[]):boolean{
    if(!userRoles || userRoles.length == 0){
        return false;
    }

    return requiredRoles.some(role =>
        userRoles.includes(role)
    );
}