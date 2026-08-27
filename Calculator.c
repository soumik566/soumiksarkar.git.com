#include <stdio.h>

int main() {
    char operator;
    double num1, num2, result;

    printf("===== Simple Calculator =====\n");

    printf("Enter first number: ");
    scanf("%lf", &num1);

    printf("Enter operator (+, -, *, /): ");
    scanf(" %c", &operator);

    printf("Enter second number: ");
    scanf("%lf", &num2);

    switch (operator) {
        case '+':
            result = num1 + num2;
            printf("Result = %.2lf\n", result);
            break;

        case '-':
            result = num1 - num2;
            printf("Result = %.2lf\n", result);
            break;

        case '*':
            result = num1 * num2;
            printf("Result = %.2lf\n", result);
            break;

        case '/':
            if (num2 == 0) {
                printf("Error: Cannot divide by zero!\n");
            } else {
                result = num1 / num2;
                printf("Result = %.2lf\n", result);
            }
            break;

        default:
            printf("Invalid operator!\n");
    }

    return 0;
}