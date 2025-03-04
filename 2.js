// [“u”, “D”, “m”, “w”, “b”, “a”, “y”, “s”, “i”, “s”, “w”, “a”, “e”, “s”, “e”, “o”, “m”,” “ ,” “]

// output Dumbways is awesome [19 char]

//selection sort

function sortArray(arr) {
  const correct = ['D', 'u', 'm', 'b', 'w', 'a', 'y', 's', ' ', 'i', 's', ' ', 'a', 'w', 'e', 's', 'o', 'm', 'e'];

  for (i = 0; i < arr.length; i++) {
    let min = i; //buat index minimum

    for (j = i + 1; j < arr.length; j++) {
      let indexJ = correct.indexOf(arr[j], i); //index J = nyari index ke j di array correct, mulai dari i
      let indexMin = correct.indexOf(arr[min], i); //index Min = nyari index ke i di array correct

      if (indexJ < indexMin) {
        min = j;
      }
    }

    if (min !== i) {
      let temp = arr[i]; //array ke i dimasukin ke temp
      arr[i] = arr[min]; //array ke i = array min
      arr[min] = temp; //array minimum tuker sama temp
    }
  }

  console.log(arr.join(''));
}

sortArray(['u', 'D', 'm', 'w', 'b', 'a', 'y', 's', 'i', 's', 'w', 'a', 'e', 's', 'e', 'o', 'm', ' ', ' ']);
