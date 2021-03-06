import { CanActivate, ExecutionContext, forwardRef, Inject, Injectable } from "@nestjs/common"
import { Reflector } from "@nestjs/core"
import { Observable } from "rxjs"
import { map } from "rxjs/operators"
import { UserService } from "../../user/user.service"
import { User } from '../../user/user.interface'

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector,
        @Inject(forwardRef(() => UserService))
        private userService: UserService) { }

    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const roles = this.reflector.get<string[]>('roles', context.getHandler()) 
        if (!roles) {
            return true
        }
        const request = context.switchToHttp().getRequest()
        const user = request.user.user
        return this.userService.findOne(user.id).pipe(
            map((user: User) => {
                let hasPermission: boolean = false
                const hasRole = () => roles.indexOf(user.role) > -1
                console.log(request.user.user)

                if (hasRole()) {
                    hasPermission = true;
                };
                return user && hasPermission;
            })
        )
    }
}