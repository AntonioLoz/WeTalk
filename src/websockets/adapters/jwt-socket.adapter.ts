import { INestApplicationContext, UnauthorizedException } from "@nestjs/common";
import { IoAdapter } from "@nestjs/platform-socket.io";
import { ServerOptions, Server } from "socket.io";
import { JwtStrategy } from "src/auth/jwt.strategy";
import { TokenDTO } from "src/models/token.dto";
import { AuthService } from "src/services/auth.service";
import { CustomSocket } from "../customSocket";


export class JwtSocketAdapter extends IoAdapter {

    private jwtStrategy: JwtStrategy;
    private authService: AuthService;

    constructor(private app: INestApplicationContext) {
        super(app);
        this.jwtStrategy = this.app.get<JwtStrategy, JwtStrategy>(JwtStrategy);
        this.authService = this.app.get<AuthService, AuthService>(AuthService);
    }

    create(port: number, options?: ServerOptions) {
        return this.createIOServer(port, options);
    }

    createIOServer(port: number, options?: ServerOptions): Server {
        // options.allowRequest = async (request: IncomingMessage, allowFunction) => {
            
        //     try {
                
        //         const token =  new TokenDTO(request.url.substring(request.url.indexOf('token=') + 6, request.url.indexOf('&')));
        //         const decToken = await this.authService.verify(token);
        //         const jwtPayload = new JwtPayload(decToken.username);                

        //         const user = await this.jwtStrategy.validate(jwtPayload);
            
        //     } catch (err) {
        //         console.warn("Failed to autheticate user:", err);
        //         return allowFunction("Unauthorized", false);
        //     }
        //     return allowFunction(null, true);
        // };

        const server: Server = super.createIOServer(port, options);

        // Registra un nuevo middelware
        server.use( async (socket: CustomSocket, next) => {
            console.log("token in adapter:", socket.handshake.query.token);
            
            if(!socket.handshake.query.token) {
                next(new UnauthorizedException());
            }
            socket.user = await this.authService.verify(new TokenDTO(socket.handshake.query.token));
            next();
            
        });
        return server;
    }
    
}