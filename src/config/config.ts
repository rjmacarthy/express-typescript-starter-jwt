import { sync } from "glob";
import { union } from "lodash";

export default class Config {
	public static port: number = 3000;
	public static routes: string = "./dist/routes/**/*.js";
	public static models: string = "./dist/models/**/*.js";
	public static useMongo: boolean = true;
	public static jwtSecret = process.env.JWT_SECRET || 'thisisasecret';
	public static mongodb = process.env.NODE_ENV === 'docker' ? 
	'mongodb://mongo:27017/express-typescript-starter-authentication' : 
	'mongodb://localhost:27017/express-typescript-starter-authentication';
	public static globFiles(location: string): string[] {
		return union([], sync(location));
	}
}