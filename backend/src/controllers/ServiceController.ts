import { GET, Path } from "typescript-rest";
import { Produces } from "typescript-rest-swagger";

@Produces("application/json")
@Path("/")
export class ServiceController
{
    @Path("/test")
    @GET
    public test(): void
    {
        console.log("test");
    }
}
