| DATE | STATUS | COMMENT |

02-jul | WIP |

1. started delete functionality
   -on documents row delete --> adds docuemnt to cleanup table --> needs a postgres webhook tht then deletes the file from storage - must use supabase storage api

2. in process of returning all document data once successfully uploaded so we can show status changes in real time, but also build list of all documents. USer clicks on document name for deletion
