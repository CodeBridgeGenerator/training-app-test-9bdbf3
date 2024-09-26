
    module.exports = function (app) {
        const modelName = 'business_information';
        const mongooseClient = app.get('mongooseClient');
        const { Schema } = mongooseClient;
        const schema = new Schema(
          {
            OrganizationName: { type: String, required: true, unique: false, lowercase: false, uppercase: false, index: false, trim: false },
NumberofEmployees: { type: Number, required: false, max: 10000000 },
FullTimeEployees: { type: Number, required: false, max: 10000000 },
PartTimeEmployees: { type: Number, required: false, max: 10000000 },

            
            createdBy: { type: Schema.Types.ObjectId, ref: "users", required: true },
            updatedBy: { type: Schema.Types.ObjectId, ref: "users", required: true }
          },
          {
            timestamps: true
        });
      
       
        if (mongooseClient.modelNames().includes(modelName)) {
          mongooseClient.deleteModel(modelName);
        }
        return mongooseClient.model(modelName, schema);
        
      };