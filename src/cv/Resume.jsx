import React, { useState } from "react";
import Certification__Form from "./Certification__Form";
import Educational__Form from "./Educational__Form";
import ProfessionalExperience from "./ProfessionalExperience";
import Project__Form from "./Project__Form";
import Skills__Form from "./Skills__Form";
import UserInfoForm from "./UserInfo__Form";
import "./Resume.css";


import { makeStyles } from "@material-ui/core/styles";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";

function getSteps() {
  return [
    "Informations personnelles",
    "Expérience professionnelle",
    "Diplôme d'études",
    "Projets",
    "Attestations",
    "Compétences",
  ];
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  backButton: {
    marginRight: theme.spacing(1),
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  appBar: {
    position: "relative",
  },
  stepper: {
      width: "100%",
      overflowX:"auto",
    // marginLeft: theme.spacing(2),
    // marginRight: theme.spacing(2),
      marginBottom:"-3rem",
    [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
      width: 800,
      marginLeft: "auto",
      marginRight: "auto",
    },
  },
  paper: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    padding: theme.spacing(1),
    [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
      marginTop: theme.spacing(6),
      marginBottom: theme.spacing(2),
      padding: theme.spacing(3),
    },
    },
    btn: {
        position: "absolute",
        right:"10px",
      
  }
}));

function Resume() {
  const classes = useStyles();

  const [step, setStep] = useState(0);
  const [state, setState] = useState({
    userInfo: "",
    objective: "",
    skills: "",
    certification: "",
    project: [],
    educational: "",
  });

 
  const handleChange = (value) => {
    // const { name, value } = e.target

    setState({
      ...state,
      objective: value,
    });

  };

  
  const handleEducationalForm = (value) => {
    setState({
      ...state,
      educational: [value],
    });
  };
 
  const nextStep = (e) => {
    setStep(step + 1);
  };

  const prevStep = (e) => {
    setStep(step - 1);
  };


  function getComponentStep(step) {
    switch (step) {
      case 0:
        return (
          <UserInfoForm
            nextStep={nextStep}
          />
        );

      case 1:
        return (
          <ProfessionalExperience
           
            nextStep={nextStep}
            prevStep={prevStep}
          />
        );

      case 2:
        return (
          <Educational__Form
          
            nextStep={nextStep}
            prevStep={prevStep}
          />
        );

      case 3:
        return (
          <Project__Form
            
            nextStep={nextStep}
            prevStep={prevStep}
          />
        );

      case 4:
        return (
          <Certification__Form
     
            nextStep={nextStep}
            prevStep={prevStep}
          />
        );

      case 5:
        return (
          <Skills__Form
       
            nextStep={nextStep}
            prevStep={prevStep}
          />
        );


      default:
        break;
    }
  }

  const steps = getSteps();

    return (
      <>
   


          <Stepper className={classes.stepper} activeStep={step} alternativeLabel>
            {steps.map((label,index) => (
              <Step key={label} onClick={()=>setStep(index)}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {getComponentStep(step)}
      
            </>
  );
}

export default Resume;
