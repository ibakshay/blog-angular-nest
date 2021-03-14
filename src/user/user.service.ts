import {Injectable} from '@nestjs/common'
import {InjectRepository} from '@nestjs/typeorm'
import {UserEntity} from './user.entity'
import {Repository} from 'typeorm'
import {User} from './user.interface'
import {Observable, from, throwError} from 'rxjs'
import {map, catchError, switchMap} from 'rxjs/operators'
import {AuthService} from 'src/auth/auth.service'

@Injectable()
export class UserService {
    constructor(@InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
        private authService: AuthService
    ) { }

    create(user: User): Observable<User> {
        return this.authService.hashPassword(user.password).pipe(
            switchMap((passwordHash: string) => {
                const newUser = new UserEntity()
                newUser.email = user.email
                newUser.name = user.name
                newUser.email = user.email
                newUser.password = passwordHash
                return from(this.userRepository.save(newUser)).pipe(
                    map((user: User) => {
                        const {password, ...result} = user
                        return result
                    }),
                    catchError(err => throwError(err))
                )
            })
        )
    }

    findAll(): Observable<User[]> {
        return from(this.userRepository.find()).pipe(
            map((users: User[]) => {
                users.forEach(function (v) {delete v.password});
                return users;
            })
        );
    }

    findOne(id: number): Observable<User> {
        return from(this.userRepository.findOne()).pipe(
            map((user: User) => {
                const {password, ...result} = user
                return result
            })
        )
    }

    deleteOne(id: number): Observable<any> {
        return from(this.userRepository.delete(id))
    }

    updateOne(id: number, user: User): Observable<any> {
        delete user.email;
        delete user.password;

        return from(this.userRepository.update(id, user))
    }

    login(user: User): Observable<string> {
        return from(this.validateUser(user.email, user.password).pipe(
            switchMap((user: User) => {
                if (user) {
                    return this.authService.generateJWT(user).pipe(map((jwt: string) => jwt))
                } else {
                    return "wrong credentials"
                }
            })
        ))
 
    }

    validateUser(email: string, password: string): Observable<User> {
        return this.findByMail(email).pipe(
            switchMap((user: User) => this.authService.comparePasswords(password, user.password).pipe(
                map((match: boolean) => {
                    if (match) {
                        const {password, ...result} = user
                        return result
                    } else {
                        throw Error
                    }
                })
            ))
        )
    }

    findByMail(email: string): Observable<User> {
        return from(this.userRepository.findOne({email}))
    }
}


