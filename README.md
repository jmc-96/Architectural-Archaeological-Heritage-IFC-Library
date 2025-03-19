# A²Heritage IFC data library
The A²Heritage data library uses the IFC 4X3 schema.

It has been developed for use in architectural and archaeological heritage under the HBIM methodology

-Historical Phases and 

-Decay analysis: the library stresses the IfcSurfaceFeature, a subclass of IfcSurfaceFeature that can represent as a 'USERDEFINED' a decay-analyzed surface. This class can be enriched with the created PropertySet template "Decay - Report (E73 Information Object)", which contains the following properties:
  -Decay (E3 Condition State)
  -Cause (E5 Event)
  -Monitoring (E7 Activity)
  -Proficient subject (E21 Person)
  -Planned actions (E7 Activity)
  -Suggested interventions (E7 Activity)
  -Material affected (E57 Material)
  -Previous Intervention (E11 Modification)
  -Last Intervention Date (E11 Modification)
  -Affected Building Component (B3 FMBS)

-Facility Management (FM): architectural interventions' requirements are considered. These include refurbishing, adaptive reuse, restoration, conservation, renovation, adaptive reuse, preservation, rehabilitation, and retrofitting. Datasheets may include facility name, discipline, inspection item, inspection method, inspection cycle, expected service life, etc. 
