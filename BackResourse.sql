CREATE OR REPLACE PROCEDURE ABIZADM.SY200_USER_SOURCE_LOG 
IS
    v_CRTN_YMD VARCHAR2 (8) := '';
    v_pgmid           VARCHAR2 (25) := 'SY200_USER_SOURCE_LOG';         /* 프로그램 아이디 */
    v_descr           VARCHAR (1000);                   /* descr CODE           */
    v_descr2           VARCHAR (1000):= ' ' ;           /* descr CODE           */
    v_error_code      VARCHAR (50);                     /* ERROR CODE           */
    v_error_message   VARCHAR (300);   

    V_DATE date;
    V_START_DATE date;
    V_END_DATE date;
    c1 clob := '';
    c2 varchar2(32000);
    
BEGIN 

    FOR REC IN (
       SELECT *
         FROM ALL_OBJECTS O 
        WHERE EXISTS (SELECT 1 FROM USER_SOURCE 
                        WHERE O.OBJECT_NAME = NAME
                          AND O.OBJECT_TYPE = TYPE
                     )
          AND OWNER = 'ABIZADM' 
          AND NOT EXISTS (SELECT 1 FROM sy200 
                           WHERE O.OBJECT_NAME = NAME
                            AND O.OBJECT_TYPE = TYPE
                            AND O.LAST_DDL_TIME = VBG_CRE_DT 
                     )
          --and created = last_ddl_time
          ORDER BY OBJECT_NAME
    )
    LOOP
        C1 := 'CREATE OR REPLACE ';
        FOR REC2 IN (
            SELECT TEXT 
              FROM USER_SOURCE
             WHERE NAME = REC.OBJECT_NAME
               AND TYPE = REC.OBJECT_TYPE
            ORDER BY LINE 
        )  
        LOOP
            SELECT CONCAT(C1, REC2.TEXT) INTO C1 FROM DUAL;
        END LOOP;
    
        INSERT INTO SY200(NAME,TYPE,TEXT,VBG_CRE_DT)
        VALUES(REC.OBJECT_NAME,REC.OBJECT_TYPE,C1,REC.LAST_DDL_TIME);
    END LOOP;  

    COMMIT;
    
EXCEPTION 
    WHEN OTHERS THEN
        v_error_code := TO_CHAR (SQLCODE);
        v_error_message := SQLERRM;  
        sp_PROC_LOG(v_pgmid, 'N',v_descr, v_error_code, v_error_message);--PROCLOG
        
END;
