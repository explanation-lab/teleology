# Placeholders analysis

Open `Placeholders.Rproj` in RStudio and knit `Placeholders.Rmd`. The analysis reads the de-identified `data/Norming/responses.csv` and `data/Norming/demographics.csv` relative to the repository root. Both use the same randomly assigned `participant_id` for each person and are ignored by Git. Keep the original Console exports outside the checkout.

The analysis checks that the export contains 40 choices and one demographics record for each of the 100 main study participants. The knitted report includes an aggregate demographics table and the ranked items. Knitting also writes the stacked bar PDF to `figures/Norming/exp1_top_stacked.pdf`.

The R packages are `tidyverse`, `knitr`, `rmarkdown`, and `bookdown`. The top-item ranking and stacked bars follow [Experiment 1 in Teleology and Generics](https://github.com/cicl-stanford/teleology_generics/blob/910a1bfdee68f4565edd2157bd495fa683ef4858/code/R/teleology_and_generics.Rmd#L144-L221).
