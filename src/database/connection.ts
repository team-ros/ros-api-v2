import mongoose from "mongoose"

mongoose.connect(String(process.env.DATABASE_URL), {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

export default mongoose