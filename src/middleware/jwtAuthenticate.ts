import { AuthenticatedRequest } from '../../express'; 
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';



const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database(
  "/Users/macbook/Desktop/week-6-pod-d-abdrasaq14/lib/src/usersAndNote.db",
  sqlite3.OPEN_READWRITE,
  (err: any) => {
    if (err) return console.log(err);
  }
);

async function authenticate(req: AuthenticatedRequest, res: Response, next: NextFunction){
  // @ts-ignore
  const token = req.header('Authorization')?.replace('Bearer ', '');
  // const token = req.query.token as string;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, 'your-secret-key') as { userId: number };
    const queryUser = `SELECT UserId FROM Users WHERE UserId = ?`; 
    const userIdFromDatabase:Record<string, number> = {}
    const selectedUserId: Record<string, number>[] = await new Promise((resolve, reject)=>{
        db.all(queryUser, [decoded.userId], (err:Error, userReturned:Record<string, number>[])=>{
            if(err){
                reject(res.status(500).json({
                    message: `userId not found`
                }))
            }
            else{
                resolve(Object.assign(userIdFromDatabase, ...userReturned)) 
            }
        })
    });

    if (!userIdFromDatabase) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    else{
      // get userid from the login and passing to the next function
      req.user = { UserId: userIdFromDatabase.UserId }; // Attach the user to the request for further use
    }
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'Unauthorized' });
  }
};

export { authenticate }