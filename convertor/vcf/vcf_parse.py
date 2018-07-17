
"""
    The vcf_parser library comes from https://github.com/moonso/vcf_parser.
    You need to run pip install vcf_parser to get the lib.
    I tried to follow this example as best I can: https://www.hl7.org/fhir/sequence-example-fda-comparisons.json.html
"""
from vcf_parser.parser import VCFParser, HeaderParser
import json
from pprint import pprint
import sys,os

def get_meta_lines(filepath):
    meta_lines = []
    a = {}
    # Get all meta data lines
    with open(filepath, 'r') as rf:
        for line in rf:
            if line.startswith("##"):
                meta_lines.append(line)
    return meta_lines

"""
    Out:
        A FHIR Sequence Resource encoded as a JSON object
    In:
        filepath: filepath to VCF file
        patient_reference: identifier of the patient where the VCF data came from
        ref_window_start: start position of the window on the reference sequence
        ref_window_end: end position of the window on the reference sequence
"""
def vcf_to_sequence(filepath, patient_reference, ref_window_start, ref_window_end):
    
    # First parse the meta data lines (the lines that begin with ##), decide what to do with these lines later
    meta_lines = get_meta_lines(filepath)
    header_parser = HeaderParser()
    for line in meta_lines:
        header_parser.parse_meta_data(line) # Parses meta data lines and stores them in member variables of header_parser

    # Then generate the important fields of the sequence resource
    sequence_resource = {}
    sequence_resource["species"] = {"text": "Homo sapiens"}
    sequence_resource["resourceType"] = "Sequence"
    sequence_resource["id"] = "SequenceID" # Change this to something that makes sense in our system
    sequence_resource["type"] = "DNA"
    sequence_resource["coordinateSystem"] = 1 # VCF files use 1 based coord system
    sequence_resource["patient"] = {'reference' : 'Patient/' + patient_reference}

    # Obtained from VCF file
    sequence_resource['referenceSeq'] = {}
    sequence_resource["referenceSeq"]['referenceSeqPointer'] = "refSequencePointer" # Change this to something that makes sense in our system
    sequence_resource['referenceSeq']['strand'] = 1 # VCF files have directionality == 1
    sequence_resource['referenceSeq']["windowStart"] = ref_window_start
    sequence_resource['referenceSeq']["windowEnd"] = ref_window_end

    vcf_parser = VCFParser(infile=filepath, split_variants=True, check_info=True) # parses the VCF file

    sequence_resource['variant'] = [] # list of all SNP (single nucleotide polymorphism) variants recorded in VCF file
    sequence_resource['quality'] = [] # List of qualities of all variants

    for variant in vcf_parser:
        # Add an observed variant to the resource's variant field
        sequence_variant = {}
        sequence_variant['start'] = int(variant['POS']) # The 1-based position on the reference sequence where the variation starts
        sequence_variant['end'] = int(variant['POS']) + len(variant['REF']) # The 1-based position on the reference sequence where the variation ends
        sequence_variant['observedAllele'] = variant['ALT'] # base pair on observed sequence
        sequence_variant['referenceAllele'] = variant['REF'] # base pair on reference sequence
        sequence_resource['variant'].append(sequence_variant)

        # Add a quality score for each variant
        sequence_quality = {}
        sequence_quality['type'] = 'snp' # a snp variant just means 1 base pair is different
        sequence_quality['start'] = int(variant['POS']) # The 1-based position on the reference sequence where the variation starts
        sequence_quality['end'] = int(variant['POS']) + len(variant['REF']) # The 1-based position on the reference sequence where the variation ends
        sequence_quality['score'] = variant['QUAL']
        sequence_resource['quality'].append(sequence_quality)

        sequence_resource['referenceSeq']['chromosome'] = variant['CHROM'] # ID of the reference chromosome
        sequence_resource['observedSeq'] = variant['ID'] # ID of the observed (ALT) chromosome         
    with open(os.getcwd()+"\\convertor\\vcf\\out\\"+filePath.split('/')[-1].split(".")[0]+'.json','w') as outfile:
        json.dump(sequence_resource, outfile)
        print( os.getcwd()+"\\convertor\\vcf\\out\\"+filePath.split('/')[-1].split(".")[0]+'.json')
# example usage
#sequence_resource = vcf_to_sequence('vcf_sample_data/FT.vcf', 'patient6', 1100, 3000)

filePath = sys.argv[1]
sequence_resource = vcf_to_sequence(filePath, 'patient6', 1100, 3000)
