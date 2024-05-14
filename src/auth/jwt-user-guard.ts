import { ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Observable } from "rxjs";
import { Payload } from "./types";

export class JwtUserGuard extends AuthGuard('jwt'){
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        return super.canActivate(context);
    }
    handleRequest<TUser = Payload>(err: any, user: any,): TUser {
        if(err || !user) throw err || new UnauthorizedException();
        console.log(user);
        throw err || new UnauthorizedException();
    }
}