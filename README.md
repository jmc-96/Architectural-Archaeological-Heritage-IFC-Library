# *A²Heritage* IFC data library

## **:arrow_forward: Introduction**

The *A²Heritage* data library uses the IFC 4X3 schema and promotes openBIM and open-source frameworks in cultural heritage. Due to a lack of standardized data libraries for **Heritage Building Information Modeling (HBIM)**, *A²Heritage* is intended to be used and extended by all BIM users. For this reason, we are working to provide scientific and professional feedback to be used in future versions of BIM software. 

Concepts of the **CIDOC-CRM** ontology are mapped into the (i) IFC schema and the (ii) customized IfcPropertySet included in the library. Specifically, the extension CRM-ba, created for the building archaeology approach, is stressed.
## **📍 Architectural Analysis**

Ontological models related to historical buildings, vaulted systems, and building archaeology, within the Getty Thesaurus and vocabularies (AAT), are used to semantically represent and describe building elements. Just to use some examples:

- **IfcSlabType:** This object type is used to represent the intrados of a vault net.
- **IfcSpaceType:** The current version of the library includes different tailored spaces for cultural heritage:
 
  - Servant and served spaces for specific buildings, for example, a Roman Theater;
    
  - Vaulted room/bay space for specific spaces covered with a historic vaulted system.
    
- **IfcWallType:** Brick and rubble masonry have already been integrated in this list.

As you can imagine, a long list of *IfcObjectType* is required to cover the complexity and variety of cultural heritage assets.

⬇️ An example is represented in the following image, developed as a figure for the paper presented in [Muñoz-Cádiz et al., 2024](https://rivistatema.com/scan-to-meshbim-implementing-knowledge-about-historical-vaulted-ceilings-with-open-tools/), where a vaulted system of the Urbino Ducal Palace (Italy) is enriched with our data library:

![HBIM vault](https://github.com/jmc-96/Architectural-Archaeological-Heritage-IFC-Data-Library/blob/main/Images/Figure%2034.%20HBIM_Vault.png?raw=true)


## **📍 Historical Analysis**

*This section is under development*

## **📍 Decay Analysis**

The library highlights the use of **IfcSurfaceFeature** (with the “USERDEFINED” option) to represent decay-analyzed surfaces. This can be enriched by the PropertySet template **“Decay – Report (E73 Information Object)”**, containing the following properties mapped with CIDOC-CRM entities:
- **Decay** (E3 Condition State)  
- **Cause** (E5 Event)  
- **Monitoring** (E7 Activity)  
- **Proficient Subject** (E21 Person)  
- **Planned Actions** (E7 Activity)  
- **Suggested Interventions** (E7 Activity)  
- **Material Affected** (E57 Material)  
- **Previous Intervention** (E11 Modification)  
- **Last Intervention Date** (E11 Modification)  
- **Affected Building Component** (B3 FMBS)

*More aspects related to this section will be specified soon!*

## **📍 Facility Management (FM)**

Architectural intervention requirements are covered by the library. These 4D aspects include refurbishing, restorative conservation, renovation, adaptive reuse, preservation, rehabilitation, and retrofitting. Datasheets can include facility name, discipline, inspection item, inspection method, inspection cycle, expected service life, and more.

⬇️ The next figures show specific cases of FM approaches in HBIM. This content is part of the research presented in [Muñoz-Cádiz et al., 2025](https://www.sciencedirect.com/science/article/pii/S2212054825000335?via%3Dihub#sec3).

First, an example in the Roman Theater of Hadrianopolis (Albania), where the HBIM project is based on spatial analysis for building reuse:
![Hadrianopolis_HBIM](https://github.com/jmc-96/Architectural-Archaeological-Heritage-IFC-Data-Library/blob/main/Images/Figure%2046.%20Hadrianopolis_results.png?raw=true)

Second, how specific 4D aspects are represented through IFC mapped with CIDOC-CRM:

![IFCSchemaCIDOC](https://github.com/jmc-96/Architectural-Archaeological-Heritage-IFC-Data-Library/blob/main/Images/Figure%207.png?raw=true)


🚨 The library is under construction! Many aspects are still preliminarily stated. For example, the mapped CIDOC entities and properties are not extended to the architectural analysis. This and other section require further work and collaboration with other experts and BIM users. For these reasons, **we ask you to lend a hand in constructing the first open-source data library for HBIM projects**.
