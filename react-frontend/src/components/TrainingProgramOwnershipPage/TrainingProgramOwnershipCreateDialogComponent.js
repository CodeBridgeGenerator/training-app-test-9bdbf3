import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import client from "../../services/restClient";
import _ from "lodash";
import initilization from "../../utils/init";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
const OrganizationTypeArray = ["SendirianBerhad","Berhad"];
const OrganizationTypeOptions = OrganizationTypeArray.map((x) => ({ name: x, value: x }));
const getSchemaValidationErrorsStrings = (errorObj) => {
    let errMsg = {};
    for (const key in errorObj.errors) {
      if (Object.hasOwnProperty.call(errorObj.errors, key)) {
        const element = errorObj.errors[key];
        if (element?.message) {
          errMsg[key] = element.message;
        }
      }
    }
    return errMsg.length ? errMsg : errorObj.message ? { error : errorObj.message} : {};
};

const TrainingProgramOwnershipCreateDialogComponent = (props) => {
    const [_entity, set_entity] = useState({});
    const [error, setError] = useState({});
    const [loading, setLoading] = useState(false);
    const urlParams = useParams();
    const [OrganizationName, setOrganizationName] = useState([])

    useEffect(() => {
        let init  = {};
        if (!_.isEmpty(props?.entity)) {
            init = initilization({ ...props?.entity, ...init }, [OrganizationName], setError);
        }
        set_entity({...init});
    }, [props.show]);

    const validate = () => {
        let ret = true;
        const error = {};
          
            if (_.isEmpty(_entity?.OwnershipType)) {
                error["OwnershipType"] = `OwnershipType field is required`;
                ret = false;
            }
        if (!ret) setError(error);
        return ret;
    }

    const onSave = async () => {
        if(!validate()) return;
        let _data = {
            OrganizationName: _entity?.OrganizationName?._id,OrganizationType: _entity?.OrganizationType,OwnershipType: _entity?.OwnershipType,
            createdBy: props.user._id,
            updatedBy: props.user._id
        };

        setLoading(true);

        try {
            
        const result = await client.service("trainingProgramOwnership").create(_data);
        const eagerResult = await client
            .service("trainingProgramOwnership")
            .find({ query: { $limit: 10000 ,  _id :  { $in :[result._id]}, $populate : [
                {
                    path : "OrganizationName",
                    service : "businessInformation",
                    select:["OrganizationName"]}
            ] }});
        props.onHide();
        props.alert({ type: "success", title: "Create info", message: "Info TrainingProgramOwnership updated successfully" });
        props.onCreateResult(eagerResult.data[0]);
        } catch (error) {
            console.log("error", error);
            setError(getSchemaValidationErrorsStrings(error) || "Failed to create");
            props.alert({ type: "error", title: "Create", message: "Failed to create in TrainingProgramOwnership" });
        }
        setLoading(false);
    };

    useEffect(() => {
                    // on mount businessInformation
                    client
                        .service("businessInformation")
                        .find({ query: { $limit: 10000, $sort: { createdAt: -1 }, _id : urlParams.singleBusinessInformationId } })
                        .then((res) => {
                            setOrganizationName(res.data.map((e) => { return { name: e['OrganizationName'], value: e._id }}));
                        })
                        .catch((error) => {
                            console.log({ error });
                            props.alert({ title: "BusinessInformation", type: "error", message: error.message || "Failed get businessInformation" });
                        });
                }, []);

    const renderFooter = () => (
        <div className="flex justify-content-end">
            <Button label="save" className="p-button-text no-focus-effect" onClick={onSave} loading={loading} />
            <Button label="close" className="p-button-text no-focus-effect p-button-secondary" onClick={props.onHide} />
        </div>
    );

    const setValByKey = (key, val) => {
        let new_entity = { ..._entity, [key]: val };
        set_entity(new_entity);
        setError({});
    };

    const OrganizationNameOptions = OrganizationName.map((elem) => ({ name: elem.name, value: elem.value }));

    return (
        <Dialog header="Create TrainingProgramOwnership" visible={props.show} closable={false} onHide={props.onHide} modal style={{ width: "40vw" }} className="min-w-max" footer={renderFooter()} resizable={false}>
            <div className="grid p-fluid overflow-y-auto"
            style={{ maxWidth: "55vw" }} role="trainingProgramOwnership-create-dialog-component">
            <div className="col-12 md:col-6 field mt-5">
            <span className="align-items-center">
                <label htmlFor="OrganizationName">Organization Name:</label>
                <Dropdown id="OrganizationName" value={_entity?.OrganizationName?._id} optionLabel="name" optionValue="value" options={OrganizationNameOptions} onChange={(e) => setValByKey("OrganizationName", {_id : e.value})}  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["OrganizationName"]) ? (
              <p className="m-0" key="error-OrganizationName">
                {error["OrganizationName"]}
              </p>
            ) : null}
          </small>
            </div>
<div className="col-12 md:col-6 field mt-5">
            <span className="align-items-center">
                <label htmlFor="OrganizationType">Organization Type:</label>
                <Dropdown id="OrganizationType" value={_entity?.OrganizationType} options={OrganizationTypeOptions} optionLabel="name" optionValue="value" onChange={(e) => setValByKey("OrganizationType", e.value)}  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["OrganizationType"]) ? (
              <p className="m-0" key="error-OrganizationType">
                {error["OrganizationType"]}
              </p>
            ) : null}
          </small>
            </div>
<div className="col-12 md:col-6 field mt-5">
            <span className="align-items-center">
                <label htmlFor="OwnershipType">OwnershipType:</label>
                <InputText id="OwnershipType" className="w-full mb-3 p-inputtext-sm" value={_entity?.OwnershipType} onChange={(e) => setValByKey("OwnershipType", e.target.value)}  required  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["OwnershipType"]) ? (
              <p className="m-0" key="error-OwnershipType">
                {error["OwnershipType"]}
              </p>
            ) : null}
          </small>
            </div>
            <small className="p-error">
                {Array.isArray(Object.keys(error))
                ? Object.keys(error).map((e, i) => (
                    <p className="m-0" key={i}>
                        {e}: {error[e]}
                    </p>
                    ))
                : error}
            </small>
            </div>
        </Dialog>
    );
};

const mapState = (state) => {
    const { user } = state.auth;
    return { user };
};
const mapDispatch = (dispatch) => ({
    alert: (data) => dispatch.toast.alert(data),
});

export default connect(mapState, mapDispatch)(TrainingProgramOwnershipCreateDialogComponent);
