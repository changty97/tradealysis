import { app } from "./App";
import { PORT } from "./constants/globals";

app.listen(PORT, () =>
{
    // eslint-disable-next-line no-console
    console.log(`Service listening on port ${PORT}`);
});
