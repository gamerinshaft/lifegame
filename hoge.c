#include <stdio.h>
#include <string.h>

int main(){

  char word[256];
  char oto_do[4] = "ド";
  char oto_re[4] = "レ";
  printf("%d\n",(int)oto_do);
  printf("%d\n",(int)oto_re);
  scanf("%s", word);

  int word_num = (int)(strlen(word)) / 3;
  for (int i = 0; i < word_num; i++)
  {
    printf("%s" word[0]);
    if((int)(word[word_num]) == (int)(oto_do)){
      printf("0");
    }

  }



  return 0;
}