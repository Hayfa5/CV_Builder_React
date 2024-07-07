import newRequest from "../../../utils/newRequest";
import React, { useEffect,useRef, useState } from 'react';
import { useParams } from "react-router-dom";
import { register } from 'swiper/element/bundle';
import Reviews from "../../../components/reviews/Reviews";
import { Link } from "react-router-dom";


function Profill() {
    const [users, setUsers] = useState(null);
    const [skills, setSkills] = useState([]);
    const [diplomas, setDiplomas] = useState([]);
    const [attestations, setAttestations] = useState([]);
    const [experts, setExperts] = useState([]);
    const [projects, setProjects] = useState([]);
    const [experiencepro, setExperiencepro] = useState([]);
    const [gigs, setGigs] = useState([]);
    const { id } = useParams();
    const [isCurrentUser, setIsCurrentUser] = useState(false);

    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const swiperRef = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userResponse = await newRequest.get(`/users/${id}`);
                setUsers(userResponse.data);
                setIsCurrentUser(currentUser._id === id.toString());
                
                await fetchExpert();
                await fetchExperiencePro();
                await fetchDiplomas();
                await fetchProjects();
                await fetchAttestations();
                const userSkills = await fetchSkills();
                await fetchGigsBySkillCategory(userSkills);
            } catch (error) {
                console.error('Erreur lors de la récupération des données:', error);
            }
            
            register();
            const params = {
                breakpoints: {
                    280: { slidesPerView: 1 },
                    600: { slidesPerView: 2 },
                    991: { slidesPerView: 3 },
                },
            };

            Object.assign(swiperRef.current, params);
            swiperRef.current.initialize();
        };

        fetchData();
    }, [id]);

    const fetchExpert = async () => {
        try {
            const expertsResponse = await newRequest.get(`/expert/${id}`);
            setExperts(expertsResponse.data);
        } catch (error) {
            console.error('Erreur lors de la récupération de l\'expert:', error);
        }
    };

    const fetchExperiencePro = async () => {
        try {
            const experienceproResponse = await newRequest.get(`/experiencepro/${id}`);
            setExperiencepro(experienceproResponse.data);
        } catch (error) {
            console.error('Erreur lors de la récupération de experiencepro:', error);
        }
    };

    const fetchProjects = async () => {
        try {
            const projectsResponse = await newRequest.get(`/projects/${id}`);
            setProjects(projectsResponse.data);
        } catch (error) {
            console.error('Erreur lors de la récupération de diplomas:', error);
        }
    };

    const fetchAttestations = async () => {
        try {
            const attestationsResponse = await newRequest.get(`/attestation/${id}`);
            setAttestations(attestationsResponse.data);
        } catch (error) {
            console.error('Erreur lors de la récupération de attestations:', error);
        }
    };

    const fetchDiplomas = async () => {
        try {
            const diplomasResponse = await newRequest.get(`/eductionaldiploma/${id}`);
            setDiplomas(diplomasResponse.data);
        } catch (error) {
            console.error('Erreur lors de la récupération de diplomas:', error);
        }
    };

    const fetchSkills = async () => {
        try {
            const skillsResponse = await newRequest.get(`/skills/${id}`);
            setSkills(skillsResponse.data);
            return skillsResponse.data;
        } catch (error) {
            console.error('Erreur lors de la récupération de competances:', error);
        }
    };

    const fetchGigsBySkillCategory = async (skills) => {
        try {
            const categoryIds = new Set();

            for (const skill of skills) {
                categoryIds.add(skill.category._id);
            }

            const uniqueCategoryIds = Array.from(categoryIds);
            let Gigs = [];

            for (const categoryId of uniqueCategoryIds) {
                const gigsResponse = await newRequest.get(`/gigs/${categoryId}`);
                Gigs = Gigs.concat(gigsResponse.data);    
            setGigs(Gigs);
            }
        } catch (error) {
            console.error('Erreur lors de la récupération des offres correspondantes:', error);
        }
    };


	
	return  (
		<div className="wrapper">
  
		   {users && (  <div className="left">
		   <img width="200" src={users.img ? users.img : "/img/noavatar.png"} alt="avatar" />
			<h4>{experts.length > 0 && experts[0].fullName}</h4>
			{skills.length > 0 ? (
           <div>
            <strong >Conaissance : </strong> <br/> 
			{skills.map((competence, index) => (
                <span key={index}>
                   <ul>
					{competence.category.categoryName}
				   </ul>  
                </span>
            ))}
            <br/>
            
        </div>
    ) : (
        <span>Aucune compétence disponible <br/></span> 
    )}
		  </div>
    )}
		   {users && ( <div className="right">
			<div className="info">
			  <h3>Information</h3>
			  <div className="info_data">
        <div className="data">
				  <h4>Titre de Profil :</h4>
				  <p>{experts.length > 0 && experts[0].ProfilTitel}</p>
				</div> 
				<div className="data">
				  <h4>Email :</h4>
				  <p>{experts.length > 0 && experts[0].email}</p>
				</div> 
				<div className="data">
				  <h4>Numero De Telephone :</h4>
				  <p>{users.phone}</p>
				</div> 
        <div className="data">
				  <h4>Adresse :</h4>
				  <p> {experts.length > 0 && experts[0].address}</p>
				</div>
				<div className="data">
				  <h4>Pays :</h4>
				  <p>{users.country}</p>
				</div>
				<div className="data">
				  <h4>Ville :</h4>
				  <p>{users.city}</p>
				</div>
        <div className="data">
				  <h4>Sexe :</h4>
				  <p>{experts.length > 0 && experts[0].sexe}</p>
				</div>
        <div className="data">
				  <h4>Lien Video :</h4>
				  <p>{experts.length > 0 && experts[0].videolien}</p>
				</div>
			  </div>
			</div>
	
			<div className="projects">
			  <h3>Expérience Professionnelle</h3>
        {experiencepro.length > 0 ? ( experiencepro.map((exp, index) => (
			  <div className="projects_data" key={index}>
				<div className="data">
				  <h4>Nom de Société :</h4>
				  <p>{exp.employer}</p>
				</div>
				<div className="data">
				  <h4>Fonction :</h4>
				  <p>{exp.function}</p>
				</div>
        <div className="data">
				  <h4>Responsabilités :</h4>
				  <p>{exp.responsibilities}</p>
				</div>
        <div className="data">
				  <h4>Année d'Achèvement :</h4>
				  <p>{exp.completionYear}</p>
				</div>
        <div className="data">
				  <h4>Pays :</h4>
				  <p>{exp.country}</p>
				</div>
               <div className="data">
				  <h4>Ville :</h4>
				  <p>{exp.city}</p>
				</div>
             {index < experiencepro.length - 1 && <hr />}
			  </div>
         ))) : (
         <span>Aucune Diplômes Disponible <br/></span>)}
			</div>

			<div className="projects">
			  <h3>Diplômes d'Études</h3>
			  {diplomas.length > 0 ? ( diplomas.map((diploma, index) => (
			  <div className="projects_data" key={index}>
				<div className="data">
				  <h4>Nom du Diplôme :</h4>
				  <p>{diploma.diplomName}</p>
				</div>
				<div className="data">
				  <h4>Spécialité :</h4>
				  <p>{diploma.universityName}</p>
				</div>
				<div className="data">
				  <h4>Mention :</h4>
				  <p>{diploma.marks_type}</p>
				</div>
				<div className="data">
				  <h4>Année  :</h4>
				  <p>{diploma.yearGraduation}</p>
				</div>
				<div className="data">
				  <h4>Nom de l'Université :</h4>
				  <p>{diploma.universityName}</p>
				</div>
				<div className="data">
				  <h4>Pays d'Obtention du Diplôme :</h4>
				  <p>{diploma.diplomcountry}</p>
				</div>
				{index < experiencepro.length - 1 && <hr />}
			  </div> )) ) : (
                <span>Aucune Diplômes Disponible <br/></span>)}
			</div>

			<div className="projects">
			  <h3>Projets</h3>
			  {projects.length > 0 ? ( projects.map((project, index) => (
			  <div className="projects_data" key={index}>
				<div className="data">
				  <h4>Nom Du Projet :</h4>
				  <p> {project.projectName}</p>
				</div>
				<div className="data">
				  <h4>URL Du Projet :</h4>
				  <p>{project.projectUrl}</p>
				</div>
				<div className="data">
				  <h4>Description Du Projet :</h4>
				  <p>{project.project_description}</p>
				</div>
				{index < experiencepro.length - 1 && <hr />}
			  </div> )) ) : (
               <span>Aucune Projets disponible <br/> </span>
                 )}
			</div>

			<div className="projects">
			  <h3>Attestations</h3>
			  {attestations.length > 0 ? (
                 attestations.map((attestation, index) => (
			  <div className="projects_data" key={index}>
				<div className="data">
				  <h4>Nom Du Certificat :</h4>
				  <p> {attestation.certificateName}</p>
				</div>
				<div className="data">
				  <h4>URL Du Certificat :</h4>
				  <p>{attestation.certificateUrl}</p>
				</div>
				<div className="data">
				  <h4>Description Du Certificat :</h4>
				  <p>{attestation.certificateDescription}</p>
				</div>
				{index < experiencepro.length - 1 && <hr />}
			  </div> )) ) : (
               <span>attestation <br/> </span>
                 )}
			</div>

			<div className="projects">
			  <h3>Connaissance</h3>
			  {skills.length > 0 ? (
        <div>
            <strong>Domaine :</strong> {skills.map((competence, index) => (
                <span key={index}>
                    {competence.category.categoryName}
                    {index !== skills.length - 1 ? ', ' : ''}
                </span>
            ))}
            <br/>
            <strong>Sous-Domaine :</strong> {skills.map((competence, index) => (
                <span key={index}>
                    {competence.subcategory.join(', ')}
                    {index !== skills.length - 1 ? ', ' : ''}
                </span>
            ))}
        </div>
    ) : (
        <span>Aucune compétence disponible <br/></span> 
    )}
			</div>
		  </div> )}
		 <section className='testimonials' id='testimonials'>
            <Reviews gigId={id} />
				<h2 className=' section__title'>Les Offres Correspond A Votre Profil</h2>
            <div className='testimonials__wrapper'>
            <swiper-container speed='500' ref={swiperRef} css-mode='true'>
             {gigs.map((gig, index) => (
              <swiper-slide key={index}>
               <div className='testimonials__card'>
                <div className='testimonials__text'>
                <Link to={`/gig/${gig._id}`} style={{ color: 'black'}}>{gig.description} </Link>{/* Ajoutez ici les données de l'offre que vous souhaitez afficher */}
                </div>
                {/* Ajoutez d'autres données de l'offre ici si nécessaire */}
            </div>
           </swiper-slide>
          ))}
          </swiper-container>

				</div>
                </section>
		</div>
	  );
	  
	}

export default Profill;


