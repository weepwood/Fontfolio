/** Local font bytes stay in the visitor's browser. They are never uploaded. */
export type SavedFont = { id:string; label:string; data:ArrayBuffer }
const DATABASE='fontfolio-user-fonts'
const STORE='fonts'

function openDatabase():Promise<IDBDatabase>{
  return new Promise((resolve,reject)=>{
    if(!('indexedDB' in window)){reject(new Error('IndexedDB unavailable'));return}
    const request=indexedDB.open(DATABASE,1)
    request.onupgradeneeded=()=>{
      const db=request.result
      if(!db.objectStoreNames.contains(STORE))db.createObjectStore(STORE,{keyPath:'id'})
    }
    request.onsuccess=()=>resolve(request.result)
    request.onerror=()=>reject(request.error||new Error('IndexedDB open failed'))
    request.onblocked=()=>reject(new Error('IndexedDB database blocked'))
  })
}
export async function loadSavedFonts():Promise<SavedFont[]>{
  const db=await openDatabase()
  return new Promise((resolve,reject)=>{
    const tx=db.transaction(STORE,'readonly')
    const request=tx.objectStore(STORE).getAll()
    request.onsuccess=()=>resolve(request.result as SavedFont[])
    request.onerror=()=>reject(request.error||new Error('Read failed'))
    tx.oncomplete=()=>db.close()
    tx.onabort=()=>{db.close();reject(tx.error||new Error('Read aborted'))}
  })
}
export async function saveFont(record:SavedFont):Promise<void>{
  const db=await openDatabase()
  return new Promise((resolve,reject)=>{
    const tx=db.transaction(STORE,'readwrite')
    tx.objectStore(STORE).put(record)
    tx.oncomplete=()=>{db.close();resolve()}
    tx.onerror=()=>{db.close();reject(tx.error||new Error('Save failed'))}
    tx.onabort=()=>{db.close();reject(tx.error||new Error('Save aborted'))}
  })
}
export async function deleteSavedFont(id:string):Promise<void>{
  const db=await openDatabase()
  return new Promise((resolve,reject)=>{
    const tx=db.transaction(STORE,'readwrite')
    tx.objectStore(STORE).delete(id)
    tx.oncomplete=()=>{db.close();resolve()}
    tx.onerror=()=>{db.close();reject(tx.error||new Error('Delete failed'))}
    tx.onabort=()=>{db.close();reject(tx.error||new Error('Delete aborted'))}
  })
}
