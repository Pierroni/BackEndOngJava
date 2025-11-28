package com.Caminhar.api.utils;

public class CpfVerif {

    public static boolean cpfValido(String cpf) {
        if (cpf == null) return false;


        cpf = cpf.replaceAll("\\D", "");


        if (cpf.length() != 11)
            return false;


        if (cpf.matches("(\\d)\\1{10}"))
            return false;

        try {

            int soma1 = 0;
            for (int i = 0; i < 9; i++) {
                soma1 += (cpf.charAt(i) - '0') * (10 - i);
            }
            int dv1 = 11 - (soma1 % 11);
            dv1 = (dv1 >= 10) ? 0 : dv1;


            int soma2 = 0;
            for (int i = 0; i < 10; i++) {
                soma2 += (cpf.charAt(i) - '0') * (11 - i);
            }
            int dv2 = 11 - (soma2 % 11);
            dv2 = (dv2 >= 10) ? 0 : dv2;


            return dv1 == (cpf.charAt(9) - '0') &&
                    dv2 == (cpf.charAt(10) - '0');

        } catch (Exception e) {
            return false;
        }
    }
}

