import { Injectable } from "@nestjs/common";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from '@nestjs/passport'
import { authConstants } from "src/common/constants/auth.constants";
import { Payload } from "./types";
@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy){
    constructor(){
        super(
            {
                jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
                ignoreExpiration: false,
                secretOrKey: authConstants.secret
            }
        )
    }
    async validate(payload: Payload){
        return {
            userId: payload.userId,
            email: payload.email
        };
    }
}
