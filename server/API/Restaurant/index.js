import { RestaurantModel } from "../../database/allModels";

const Router = express.Router();

/*
Route           /
description     get all restaurant details 
params          None
Access          public
Methode         Get
*/

Router.get("/", async(req, res) => {
    try{
        const {city} = req.query;
        const restaurant = await RestaurantModel.find({city});
        return res.json({restaurant});
    }
    catch(error){
        return res.status(500).json({error: error.message});
    }
});

/*
Route           /
description     get particular restaurant details on id
params          _id
Access          public
Methode         Get
*/


Router.get("/:_id", async(req, res) => {
    try{
        const {_id} = req.params;
        const restaurant = await RestaurantModel.findOne(_id);

        if(!restaurant)
            return re.status(404).json({error: "Restaurant not found"});
        
        return res.json({restaurant});
    }catch(error){
        return res.status(500).json({error: error.message});
    }
});


/*
Route           /search
description     get  restaurant details on search
params          None
body            SearchString
Access          public
Methode         Get
*/

Router.get("/search", async(req, res) => {
    try{
        const {searchString} = req.body;
        const restaurant = await RestaurantModel.find({
            name: {$regex: searchString, $options: "i"},
        });
    }
    catch{
        return res.status(500).json({error: error.message});
    }
});

export default Router;