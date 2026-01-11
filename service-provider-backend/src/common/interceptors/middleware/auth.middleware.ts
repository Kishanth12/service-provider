// import {
//   Injectable,
//   NestMiddleware,
//   UnauthorizedException,
// } from '@nestjs/common';
// import { Request, Response, NextFunction } from 'express';
// import { JwtService } from '@nestjs/jwt';

// @Injectable()
// export class AuthMiddleware implements NestMiddleware {
//   constructor(private readonly jwtService: JwtService) {}

//   async use(req: Request, res: Response, next: NextFunction) {
//     const authHeader = req.headers['authorization'];

//     if (!authHeader) {
//       throw new UnauthorizedException('Authorization header missing');
//     }

//     const [type, token] = authHeader.split(' ');

//     if (type !== 'Bearer' || !token) {
//       throw new UnauthorizedException('Invalid authorization format');
//     }

//     try {
//       const payload = await this.jwtService.verifyAsync(token, {
//         secret: process.env.JWT_SECRET,
//       });

//       // attach user info to request
//       req['user'] = payload;

//       next();
//     } catch (error) {
//       throw new UnauthorizedException('Invalid or expired token');
//     }
//   }
// }
