# *A²Heritage* IFC data library

## **:arrow_forward: Introduction**

The *A²Heritage* data library uses the IFC 4X3 schema and promotes the use of openBIM and open-source frameworks in Cultural Heritage (CH). Due to a lack of standardized data libraries for Heritage Building Information Modeling (HBIM), *A²Heritage* is intended to be used and extended by all BIM users.

The library has been developed during the PhD Thesis of Jesús Muñoz Cádiz at the Polytechnic University of Marche (Italy) for application in architectural and archaeological heritage under the HBIM methodology. Professors _________ and _________ have contributed to this approach as co-supervisors of the research.

## **:arrow_forward: Architectural Analysis**

Ontological models related to historical buildings, vaulted systems, and building archaeology, within the Getty Thesaurus and vocabularies (AAT), are used to semantically represent and describe building elements.

## **:arrow_forward: Historical Analysis**

*Description to be added.*

## **:arrow_forward: Decay Analysis**

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

