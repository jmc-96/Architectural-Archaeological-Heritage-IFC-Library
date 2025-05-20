# *A²Heritage* IFC data library

## **:arrow_forward: Introduction**

The *A²Heritage* data library uses the IFC 4X3 schema and promotes the use of openBIM and open-source frameworks in cultural heritage. Due to a lack of standardized data libraries for Heritage Building Information Modeling (HBIM), *A²Heritage* is intended to be used and extended by all BIM users. The structure introduced mapped concepts of the CIDOC-CRM ontology, specifically its extension CRM-ba created for the building archaeology approach, as tag.

The library has been developed during the PhD Thesis of Jesús Muñoz Cádiz at the Polytechnic University of Marche (Italy) for application in architectural and archaeological heritage under the HBIM methodology.

## **📍 Architectural Analysis**

Ontological models related to historical buildings, vaulted systems, and building archaeology, within the Getty Thesaurus and vocabularies (AAT), are used to semantically represent and describe building elements.

- **IfcSlaType** This object type is used to represent the intrados of a vault net.
- **IfcSpaceType:** Servant and served spaces for specific buildings, i.e., a Roman Theater; vaulted room/bay space for specific spaces covered with a historic vaulted system. 
- **IfcWallType:** Brick and rubble masonry have already been integrated in this list.

## **📍 Historical Analysis**

*Description to be added.*

## **📍 Decay Analysis**

The library highlights the use of **IfcSurfaceFeature** (with the “USERDEFINED” option) to represent decay-analyzed surfaces. This can be enriched by the PropertySet template **“Decay – Report (E73 Information Object)”**, containing:
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

## **:arrow_forward: Facility Management (FM)**

Architectural intervention requirements are covered, including refurbishing, restorative conservation, renovation, adaptive reuse, preservation, rehabilitation, and retrofitting. Datasheets can include facility name, discipline, inspection item, inspection method, inspection cycle, expected service life, and more.

