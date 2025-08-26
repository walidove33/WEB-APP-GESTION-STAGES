package com.wbs.mymovie.estbm.service;

import com.itextpdf.text.*;
import com.itextpdf.text.Font;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;
import com.wbs.mymovie.estbm.model.Stage;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;

@Service
public class ConventionGeneratorService {

    private static final Font TITLE_FONT = new Font(Font.FontFamily.HELVETICA, 18, Font.BOLD);
    private static final Font HEADER_FONT = new Font(Font.FontFamily.HELVETICA, 12, Font.BOLD);
    private static final Font NORMAL_FONT = new Font(Font.FontFamily.HELVETICA, 10);
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("dd/MM/yyyy");

    public byte[] generateConventionPdf(Stage stage) throws DocumentException {
        try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            Document document = new Document(PageSize.A4);
            PdfWriter.getInstance(document, baos);
            document.open();

            addHeader(document, stage);
            addPartiesSection(document, stage);
            addStageDetails(document, stage);
            addSignaturesSection(document);

            document.close();
            return baos.toByteArray();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    private void addHeader(Document document, Stage stage) throws DocumentException {
        Paragraph title = new Paragraph("CONVENTION DE STAGE", TITLE_FONT);
        title.setAlignment(Element.ALIGN_CENTER);
        title.setSpacingAfter(20f);
        document.add(title);

        Paragraph subtitle = new Paragraph(
                "Entre l'École Supérieure de Technologie de Béni Mellal et " + stage.getEntreprise(),
                HEADER_FONT
        );
        subtitle.setAlignment(Element.ALIGN_CENTER);
        subtitle.setSpacingAfter(30f);
        document.add(subtitle);
    }

    private void addPartiesSection(Document document, Stage stage) throws DocumentException {
        PdfPTable table = new PdfPTable(2);
        table.setWidthPercentage(100);
        table.setSpacingBefore(10f);
        table.setSpacingAfter(20f);

        // École
        addPartyCell(table, "ÉCOLE SUPÉRIEURE DE TECHNOLOGIE DE BÉNI MELLAL",
                "Adresse: Avenue Mohammed VI, Béni Mellal\nTéléphone: +212 523 485 000\nEmail: contact@estbm.ac.ma");

        // Entreprise - utilise les nouveaux champs
        String entrepriseDetails = "Adresse: " + (stage.getAdresseEntreprise() != null ? stage.getAdresseEntreprise() : "Non spécifiée") +
                "\nTéléphone: " + (stage.getTelephoneEntreprise() != null ? stage.getTelephoneEntreprise() : "Non spécifié") +
                "\nReprésentant: " + (stage.getRepresentantEntreprise() != null ? stage.getRepresentantEntreprise() : "Non spécifié");

        addPartyCell(table, stage.getEntreprise(), entrepriseDetails);

        document.add(table);
    }

    private void addPartyCell(PdfPTable table, String title, String details) {
        PdfPCell cell = new PdfPCell();
        cell.setPadding(10);

        Paragraph titlePara = new Paragraph(title, HEADER_FONT);
        titlePara.setSpacingAfter(5f);
        cell.addElement(titlePara);

        Paragraph detailsPara = new Paragraph(details, NORMAL_FONT);
        cell.addElement(detailsPara);

        table.addCell(cell);
    }

    private void addStageDetails(Document document, Stage stage) throws DocumentException {
        Paragraph sectionTitle = new Paragraph("DÉTAILS DU STAGE", HEADER_FONT);
        sectionTitle.setSpacingBefore(15f);
        document.add(sectionTitle);

        PdfPTable detailsTable = new PdfPTable(2);
        detailsTable.setWidthPercentage(100);
        detailsTable.setSpacingBefore(10f);
        detailsTable.setSpacingAfter(20f);

        addDetailRow(detailsTable, "Étudiant(e):",
                stage.getEtudiant().getNom() + " " + stage.getEtudiant().getPrenom());
        addDetailRow(detailsTable, "N° Apogée:", stage.getEtudiant().getCodeApogee());
        addDetailRow(detailsTable, "Filière:", stage.getFiliere());
        addDetailRow(detailsTable, "Sujet:", stage.getSujet());
        addDetailRow(detailsTable, "Période:",
                stage.getDateDebut().format(DATE_FORMATTER) + " au " +
                        stage.getDateFin().format(DATE_FORMATTER));
        addDetailRow(detailsTable, "Durée:",
                calculateDuration(stage.getDateDebut(), stage.getDateFin()) + " semaines");

        document.add(detailsTable);
    }

    private void addDetailRow(PdfPTable table, String label, String value) {
        PdfPCell labelCell = new PdfPCell(new Phrase(label, HEADER_FONT));
        labelCell.setBorder(Rectangle.NO_BORDER);
        table.addCell(labelCell);

        PdfPCell valueCell = new PdfPCell(new Phrase(value, NORMAL_FONT));
        valueCell.setBorder(Rectangle.NO_BORDER);
        table.addCell(valueCell);
    }

    private long calculateDuration(LocalDate start, LocalDate end) {
        return ChronoUnit.WEEKS.between(start, end);
    }

    private void addSignaturesSection(Document document) throws DocumentException {
        Paragraph signatures = new Paragraph("Signatures", HEADER_FONT);
        signatures.setSpacingBefore(30f);
        signatures.setAlignment(Element.ALIGN_CENTER);
        document.add(signatures);

        PdfPTable signatureTable = new PdfPTable(3);
        signatureTable.setWidthPercentage(100);
        signatureTable.setSpacingBefore(20f);

        addSignatureCell(signatureTable, "Le Représentant de l'Établissement");
        addSignatureCell(signatureTable, "Le Représentant de l'Entreprise");
        addSignatureCell(signatureTable, "L'Étudiant(e)");

        document.add(signatureTable);
    }

    private void addSignatureCell(PdfPTable table, String label) {
        PdfPCell cell = new PdfPCell();
        cell.setBorder(Rectangle.NO_BORDER);
        cell.setHorizontalAlignment(Element.ALIGN_CENTER);

        Paragraph labelPara = new Paragraph(label, NORMAL_FONT);
        labelPara.setSpacingAfter(40f);
        cell.addElement(labelPara);

        cell.addElement(new Paragraph("________________________"));
        table.addCell(cell);
    }
}