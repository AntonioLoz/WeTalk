import { INestApplicationContext } from "@nestjs/common";
import { IoAdapter } from "@nestjs/platform-socket.io";
import { ServerOptions, Server } from "socket.io";
import { TokenDTO } from "src/models/dtos/token.dto";
import { User } from "src/models/entities/user.entity";
import { AuthService } from "src/services/auth.service";
import { UserService } from "src/services/user.service";
import { CustomSocket } from "../customSocket";


export class JwtSocketAdapter extends IoAdapter {

    private authService: AuthService;
    private userService: UserService;

    constructor(private app: INestApplicationContext) {
        super(app);
        this.authService = this.app.get<AuthService, AuthService>(AuthService);
        this.userService = this.app.get<UserService, UserService>(UserService);
    }

    create(port: number, options?: ServerOptions) {
        return this.createIOServer(port, options);
    }

    createIOServer(port: number, options?: ServerOptions): Server {

        const server: Server = super.createIOServer(port, options);

        // Registra un nuevo middelware
        server.use( async (socket: CustomSocket, next) => {
            
            if(!socket.handshake.query.token || socket.handshake.query.token === "") {
                console.log("give me a token, cousin!");
                
                next(new Error('Authentitacion fail'));
            }            

            this.authService.verify(new TokenDTO(socket.handshake.query.token)).then( async (user: User) => {
                try{
                    await this.userService.setUserConnection(user.id, true, socket.id);
                    user.isOnline = true;
                    user.socketId = socket.id;
                    console.log("TEST[Adapter](verify): ", user);
                    
                    socket.user = user;
                    return next();
                }
                catch(error) {
                    console.log(error);
                    next(error);
                }

                

            }).catch( (err) => {
                console.log("Error verifying token:", err);
                
                next(err);
            });
        });
        return server;
    }
    
}