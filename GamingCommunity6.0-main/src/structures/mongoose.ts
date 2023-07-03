import { connect } from "mongoose";

export const connectDatabase = async () => {
    await connect("mongodb+srv://");
	console.log('Conessione al DataBase "gamingcommunity60" avvenuta con successo! ✅');
}