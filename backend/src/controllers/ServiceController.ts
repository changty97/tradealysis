import { GET, Path } from "typescript-rest";
import { Produces, Response } from "typescript-rest-swagger";
import { BadRequestError } from "typescript-rest/dist/server/model/errors";

const badRequestExampleResponse: BadRequestError = {
    name: "BadRequestError",
    message: "Your request payload was not in the expected format.",
    statusCode: 400
};

@Produces("application/json")
@Response<BadRequestError>(400, "Bad Request", badRequestExampleResponse)
@Path("/")
export class ServiceController
{
    /**
     * blah blah blah
     *
     * @returns void
     */
    @Path("/test")
    @GET
    public test(): void
    {
        // eslint-disable-next-line no-console
        console.log("test");
    }
}
