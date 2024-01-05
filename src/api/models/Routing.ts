import express, {Express} from 'express';
import mysql from 'mysql';

export default abstract class Routing {
    app: Express;
    sql: mysql.Pool;
    props: Map<String, any>;

    protected constructor(props: Map<String, any>) {
        this.props = props;
        this.app = props.get('app');
        this.sql = props.get('sql');
    }

    newRouter(): express.Router {
        return express.Router();
    }

    abstract get getRouter() : express.Router;
}