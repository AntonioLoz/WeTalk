import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { JwtPayload } from "src/models/jwt.payload";
import { User } from "src/models/entities/user.entity";
import { UserService } from "src/services/user.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

    constructor(private userService: UserService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET
        });
    }

    async validate(payload: JwtPayload): Promise<User> {
        
        const user = await this.userService.getById(payload.id);
        if(!user){
            throw new UnauthorizedException();
        }
        return user;
    }
}