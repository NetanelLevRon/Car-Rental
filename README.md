# Car Rental
### &#x202b; אתר השכרת רכבים
***

&#x202b;  בפרויקט זה מערכת אינטרנטית עבור חברת השכרת רכבים. מערכת זו מאפשרת  
למשתמש לבחור רכב להשכרה, לחשב את עלות ההשכרה המשוערת ולהחזיר את הרכב עם סיום 
השימוש
&#x202b; המערכת מכילה מספר אזורים:
#### &#x202b; אזור אורח:
1.	דף הבית 
2.	דף עבור רישום משתמש למערכת 
3.	דף עבור בחירת/חיפוש רכב להשכרה 
4.	דף עבור חישוב עלות ההשכרה 
#### &#x202b; אזור משתמש:
1.	דף עבור הזמנת רכב 
2.	דף עבור פירוט הזמנות קודמות 
#### &#x202b; אזור עובד חברה:
1.  דף עבור החזרה של רכב 
#### &#x202b; אזור מנהל:
1.	דף עבור צפייה בהזמנות 
2.	דף עבור ניהול מלאי רכבים 
3.	דף עבור ניהול משתמשים ותפקידם 

&#x202b; דף הבית מציג את שם החברה ולוגו ,ופיסקה המתארת את אודות החברה והמערכת ודף צור קשר.
###### &#x202b; שדות משתמש:
1.	שם מלא 
2.	תעודת זהות 
3.	שם משתמש  
4.	תאריך לידה 
5.	מין 
6.	אמייל 
7.	סיסמא 
8.	תמונה 
###### &#x202b; סוגי הרכבים:
1.	שם יצרן 
2.	דגם 
3.	עלות יומית 
4.	עלות יום איחור 
5.	שנת ייצור 
6.	גיר 
###### &#x202b; שדות רכב:
1.	סוג רכב 
2.	קילומטרז' נוכחי 
3.	תמונה 
4.	האם תקין להשכרה 
5.	האם פנוי להשכרה 
6.	מספר רכב 
7.	באיזה סניף נמצא 
###### &#x202b; שדות סניף:
1.	כתובת 
2.	 Latitude & Longitude (מיקום מדוייק) 
3.	שם 
###### &#x202b; שדות השכרת רכב:
1.	תאריך התחלה 
2.	תאריך החזרה 
3.	תאריך החזרה בפועל 
4.	מספר משתמש 
5.	מספר רכב 
#### &#x202b; דף עבור בחירת/חיפוש רכב להשכרה 
&#x202b; דף זה מציג את רשימת הרכבים להשכרה ממוינים לפי סוגי רכבים. 
 מאפשר חיפוש על פי:  
1.	גיר 
2.	שנה 
3.	חברה 
4.	דגם 
5.	טקסט חופשי 
6.	טווח תאריכים 
 
 &#x202b; מציג בתחתית הדף את כל הרכבים שהמשתמש התעניין בהם  (ללא רישום נישמר ב-LocalStorage) ובכל תוצאת חיפוש  ניתן לעבור לשלב ההזמנה. 
 &#x202b; רק למשתמש רשום למערכת ניתנת אפשרות לשכור רכב.
 #### &#x202b; דף עבור חישוב עלות ההשכרה 
 &#x202b; בכדי לשכור רכב, על המשתמש להזין את כמות הימים עבור ההשכרה על ידי תאריך התחלה  וסוף
 לאחר מכן מוצגת למשתמש העלות עבור הזמנתו והעלות עבור כל יום איחור
&#x202b; 
במידה והמשתמש מאשר את עלות ההשכרה,  ניתנת לו הודעה מתאימה על כך והרכב יוצא מרשימת הרכבים הפנויים להשכרה
 #### &#x202b; דף עבור החזרת הרכב – דף עבור עובד חברה 
&#x202b; דף זה מאפשר לעובד החברה להזין מספר רכב. במידה ומספר הרכב קיים במאגר, הרכב מוחזר לרשימת הרכבים הפנויים להשכרה. ומציג את העלות הכוללת של ההחזרה.  
 #### &#x202b; דפי ניהול 
&#x202b; במערכת ישנו אזור ניהול בו המנהל יכול לנהל את נתוני המערכת. 
1.	המנהל יכול למחוק/לעדכן/לערוך את הרכבים במלאי 
2.	המנהל יכול למחוק/לעדכן/לערוך את סוגי הרכבים במערכת 
3.	המנהל יכול למחוק/לעדכן/לערוך את משתמשי המערכת 
4.	המנהל יכול למחוק/לעדכן/לערוך את ההזמנות במערכת 
***
 #### &#x202b; טכנולוגיות
&#x202b; צד הלקוח מבוצע ב – Angular 6.
&#x202b; עיצוב בוצע ע"י CSS (ומעט מאד bootstrap 3.3.7).
&#x202b; צד השרת בוצע ע"י Web API.
&#x202b; העבודה מול בסיס הנתונים בוצעה ע"י Entity Framework.
&#x202b; בסיס הנתונים מסוג SQL Server.
***
 #### &#x202b; הגשה
&#x202b; בסיס הנתונים מכיל את הנתונים הבאים:
* ###### &#x202b; 5 משתמשים 
  * &#x202b; שם משתמש: nati. סיסמה: 123458
  * &#x202b; שם משתמש: maya. סיסמה: 456789
  * &#x202b; שם משתמש: mica. סיסמה: 654321
  * &#x202b; שם משתמש: noam. סיסמה: 258963
   * &#x202b; שם משתמש: custo. סיסמה: 7895123
* ###### &#x202b; 2 עובדי חברה 
   * &#x202b; שם משתמש: emp. סיסמה: 963258
   * &#x202b; שם משתמש: worky. סיסמה: 741147
* ###### &#x202b; 1 מנהל 
   * &#x202b; שם משתמש: mangi. סיסמה: 852258

* ###### &#x202b; 5  כלי רכב מסוגים שונים 
* ###### &#x202b; 4  השכרות שבהן הרכב הוחזר 
* ###### &#x202b; 1 השכרות שבהן הרכב עדיין בשימוש 
* ###### &#x202b; 1 השכרות שחל בהן איחור בהחזרת הרכב 
***