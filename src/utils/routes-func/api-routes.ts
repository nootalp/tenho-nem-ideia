import express, { Request, Response } from 'express';
import { main_Scope } from '../config';


export function getRoutes(req: Request, res: Response) {
    const routes = extractRoutes()
    res.json(routes);
}

function extractRoutes() {
    let listPathRoutes: { path: string, methods: string[] }[] = [];

    const extractMiddlewareRoutes = (stack: express.Handler[]) => {
        stack.forEach((middleware: any) => {
            if (middleware.route) {
                const methods = Object.keys(middleware.route.methods).map(method => method.toUpperCase());
                listPathRoutes.push({
                    path: middleware.route.path,
                    methods,
                });
            } else if (middleware.name === "router" && middleware.handle.stack) {
                extractMiddlewareRoutes(middleware.handle.stack);
            }
        });
    };

    extractMiddlewareRoutes(main_Scope._router.stack);
    return listPathRoutes;
}
