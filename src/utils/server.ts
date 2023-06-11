import Fastify from 'fastify';

export const buildServer = async () => {
    const app = Fastify({
        logger: {
            transport: {
                target: 'pino-pretty',
            },
        },
    });

    /**
     * register plugins
     */

    /**
     * register routes
     */

    return app;
};
