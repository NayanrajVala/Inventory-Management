export function matchRoles(requiredRoles:string[],userRoles:string[]):boolean{
    if(!userRoles || userRoles.length == 0){
        return false;
    }

    return requiredRoles.some(role =>
        userRoles.includes(role)
    );
}