function NewidGeneretor(dbInf) {
  let count = 0;
  dbInf.map((dbSpecificInfo) => {
    count = dbSpecificInfo.id + 1;
  }); return count;
}

export default NewidGeneretor;
