
import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
    PORT: number;

    NATS_SERVERS: string[];
}

const envsSchema = joi.object({
    PORT: joi.number().required(),

    NATS_SERVERS: joi.array().items( joi.string() ).required(),
})
.unknown(true); // Allow unknown environment variables

// Validate the environment variables against the schema
const { error, value } = envsSchema.validate({

    ...process.env, // Load environment variables
    NATS_SERVERS: process.env.NATS_SERVERS.split(','), // Split NATS_SERVERS by comma

});

// Throw an error if validation fails
if ( error ) {
    throw new Error(`Config validation error: ${ error.message }`);
}

// Cast validated values to the EnvVars interface
const envVars: EnvVars = value;

// Export the validated and typed environment variables
export const envs = {
    port: envVars.PORT,

    natsServers: envVars.NATS_SERVERS,
}