import { GET, POST,  Path, QueryParam } from "typescript-rest";
import { Produces, Response } from "typescript-rest-swagger";
import { BadRequestError } from "typescript-rest/dist/server/model/errors";
import { exampleInsertThing, exampleRetrieveThing, genericObject, correctLogin } from "../Mongo";

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
     * @param test
     *
     * @returns The item
     */
     @Path("/testGET")
     @GET
    public async testGET(@QueryParam("key") key: string, @QueryParam("value") value: number): Promise<genericObject[]>
    {
        return await exampleRetrieveThing({
            [key]: value
        });
    }

    /**
     * @param test
     *
     * @returns The objectId of the inserted item.
     */
    @Path("/testPOST")
    @POST
     public async testPOST(@QueryParam("test") test: number): Promise<string>
     {
         return await exampleInsertThing(test);
     }
	 
	 /**
	  * @param username:string - username entered into login page
	  * @param password:string - password entered into login page (clear text no encryption)
	  * @returns 1 if username, password pair in db. otherwuse returns 0 (str character 1, 0)
	 **/
	 @Path("/testGetDb")
	 @GET
	 public async testDBGet(@QueryParam("username") username: string, @QueryParam("password") password: string)
    {
        return await correctLogin(username, password);
	 }
}
